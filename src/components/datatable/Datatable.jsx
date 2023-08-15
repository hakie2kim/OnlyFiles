import "./datatable.scss";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import { toast, Toaster } from "react-hot-toast";

import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  userColumns,
  fileColumns,
  sharedColumns,
  trashColumns,
  enquiryColumns,
} from "../../datatablesource";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { ThreeDots } from "react-loader-spinner"; // npm install react-loader-spinner --save
import FileUploadModal from "./FileUploadModal"; // fix this
import instance from "../../axios_config";

// Pass type prop if u want to apply it to both users & products
const Datatable = ({ type }) => {
  // const [data, setData] = useState(userRows);
  const [data, setData] = useState([]);
  const { currentUser } = useContext(AuthContext);
  // axios
  const [isLoading, setLoading] = useState(false); // loading icon shown or not
  const [isModalOpen, setIsModalOpen] = useState(false); // fix this modal shown or not
  // const [ userID, setUID ] = useState(""); // get user id
  const [clientID, setClientID] = useState(""); // get client id

  // 1. Delete the user from the database
  // 2. The user needs to be deleted from the Firebase -> Authentication -> Users manually as re-authentication requires the user's password (https://firebase.google.com/docs/auth/web/manage-users#re-authenticate_a_user)
  const handleUserDelete = async (id) => {
    try {
      if (window.confirm("Are you sure to delete the user?")) {
        // ******************************* Connect with Django *******************************
        // https://firebase.google.com/docs/firestore/manage-data/delete-data#delete_documents
        await deleteDoc(doc(db, "users", id)); // doc(db, collection, id)
        setData(data.filter((item) => item.id !== id)); // If used on its own, the data is not deleted when refreshed

        // Write codes to delete the user from the backend
        // ***********************************************************************************

        toast("The user also needs to be deleted inside Firebase!", {
          icon: "⚠️",
        });
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ****************************************************** Connect with Django ******************************************************

  // file download
  const handleFileDownload = async (params) => {
    try {
      console.log(params.row.id);

      toast.loading(`${params.row.fileName} downloading`);

      const response = await instance.get(`retrievefile/${params.row.id}`, {
        responseType: "blob", // Important for handling binary data
      });

      // Create a URL object from the blob data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary anchor element to initiate the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `${params.row.fileName}${params.row.fileType}`; // Set the filename and extension for download
      document.body.appendChild(link);
      link.click();

      // Clean up the URL and anchor
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Failed to download, please contact admin");
      console.error("Error downloading file: ", error);
    }
  };
  // *********************************************************************************************************************************
  // file sharing
  const handleFileShare = async (params) => {
    try {
      // ****************************************************** Connect with Django ******************************************************
      var email = prompt("Please enter a user's email to share");

      const response = await instance.post(
        `fileshare/${email}/${params.row.id}/${params.row.userName}`
      );
      console.log("File Share response: ", response.data);

      if (response.data === "yes") {
        // Email registrant exists
        toast.success(`${params.row.fileName} shared successfully`);
      } else if (response.data === "no") {
        // Email registrant does not exist
        toast.error(`Registrant wih "${email}" does not exist`);
      }

      console.log(params.row.id); // fileID to share

      // *********************************************************************************************************************************
    } catch (error) {
      console.log("Error sharing file: ", error);
    }
  };
  // File unshare (remove file shared to you)
  const handleFileUnshare = async (params) => {
    try {
      const response = await instance.delete(
        `SharedFileAccess/${params.row.share_id}`
      );
      console.log("Response from delete shared file: ", response);
      // reload shared file table
      load_shared_files();
    } catch (error) {
      console.log("Error deleting shared file: ", error);
    }
  };

  //**************for update/upload open file pop-up modal********** */
  // fix this
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  //********************************************************** */

  // file update
  // fix this
  // - it wont work as you need a modal/form to upload the newest file to update
  const handleFileUpdate = async (params) => {
    // console.log("file_id: ", params.row.id);
    // try {
    //   // update file_id's content with the newest file
    //   const response = instance.post(`/fileupdate/${params.row.fileID}`);
    //   // Handle response if needed
    //   console.log("Response:", response.data);
    //   if (response.data === "file ok") {
    //     toast.info(`${params.row.fileName} successfully updated`);
    //   } else {
    //    toast.error(`${params.row.fileName} failed to update`);
    //   }
    // } catch (error) {
    //   // Handle error if needed
    //   console.error("Error updating file: ", error.response);
    // }
  };

  // file deletion
  const handleFileDelete = async (params) => {
    try {
      // url for deleting file requires field_id and client_id
      const response = await instance.get(
        `fileDelete/${params.row.id}/${params.row.userName}`
      );

      // check response of Delete request from django
      console.log("Deletion Response: ", response.data);
      if (response.data.status === "success") {
        toast.success(`${params.row.fileName} deleted successfully`);
        // Perform any other necessary actions after successful deletion.
        load_all_data();
      } else {
        toast.error(`${params.row.fileName} deletion failed`);
        // Handle the error case appropriately.
      }
    } catch (error) {
      console.log("Error deleting file: ", error);
    }
  };

  // file restore
  const handleFileRestore = async (params) => {
    try {
      // url for restoring a deleted file
      const response = await instance.get(`filerestore/${params.row.id}`);
      console.log("File Restore response: ", response.data);
      if (response.data === "restored") {
        toast.success(`${params.row.fileName} restored successfully`);
        load_trashed_files();
      } else {
        toast.error(`${params.row.fileName} failed restoring`);
      }
    } catch (error) {
      console.log("Error restoring file: ", error);
    }
  };

  // file delete permanently
  const handleFileDeleteForever = async (params) => {
    try {
      if (window.confirm("Are you sure to delete the file?")) {
        // URL for deleting file from logs (for deleting file from trashbin)
        const response = await instance.post(`filelog/delete/${params.row.id}`);
        console.log("File Log Deletion: ", response.data);
        if (response.data.result === "All gone") {
          console.log("File Log Delete: ", response.data.result);
          load_trashed_files();
          toast.success(`${params.row.fileName} deleted successfully`);
        } else {
          toast.error("Delete unsuccessful");
        }
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // These actionColumns will be concat to columns below
  const actionUserColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      // https://mui.com/x/react-data-grid/
      // params are from rows={data} as a prop of <DataGrid></DataGrid>
      // valueGetter
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/users/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="actionButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleUserDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  const actionFileColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="actionButton"
              onClick={() => handleFileDownload(params)}
            >
              Download
            </div>
            <div
              className="actionButton"
              onClick={() => handleFileShare(params)}
            >
              Share
            </div>
            <div
              className="updateButton"
              onClick={() => handleFileUpdate(params)}
            >
              Update
            </div>
            <div>
              {/* fix this, the modal somehow will be at the button */}
              {/* <div className="actionButton" onClick={openModal}>
                Update
              </div> */}
              {/* <FileUploadModal   // component of modal
                isOpen={isModalOpen} // open model
                closeModal={closeModal} // close modal
                fileID={params.row.id} // set file_id
                onFileUpdated={load_all_data} // load file data after update
              /> */}
            </div>
            <div
              className="deleteButton"
              onClick={() => handleFileDelete(params)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  const actionSharedColumns = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="actionButton"
              onClick={() => handleFileDownload(params)}
            >
              Download
            </div>
            <div
              className="actionButton"
              onClick={() => handleFileUnshare(params)}
            >
              Unshare
            </div>
          </div>
        );
      },
    },
  ];

  const actionTrashColumns = [
    {
      field: "action",
      headerName: "Action",
      width: 240,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="actionButton"
              onClick={() => handleFileRestore(params)}
            >
              Restore
            </div>
            <div
              className="deleteButton"
              onClick={() => handleFileDeleteForever(params)}
            >
              Delete permanently
            </div>
          </div>
        );
      },
    },
  ];

  const actionEnquiryColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="actionButton">Reply</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleUserDelete(params.row.id)}
            >
              Delete
            </div>
            <div
              className="actionButton"
              onClick={() => handleFileUnshare(params)}
            >
              Unshare
            </div>
          </div>
        );
      },
    },
  ];

  // These are to choose what columns and action buttons to put according to type
  var columns;
  var actionColumn;
  switch (type) {
    case "users":
      columns = userColumns;
      actionColumn = actionUserColumn;
      break;
    case "files":
      columns = fileColumns;
      actionColumn = actionFileColumn;
      break;
    case "shared":
      columns = sharedColumns;
      actionColumn = actionSharedColumns;
      break;
    case "trash":
      columns = trashColumns;
      actionColumn = actionTrashColumns;
      break;
    case "enquiries":
      columns = enquiryColumns;
      actionColumn = actionEnquiryColumn;
      break;
    default:
      break;
  }

  // Run only once when the component is build
  useEffect(() => {
    // ************************** Connect with Django **************************

    console.log("u_id: ", currentUser.uid);

    // get client_id from url: api/client/getid/<u_id>
    instance
      .get(`client/getid/${currentUser.uid}`)
      .then((res) => {
        setClientID(res.data.client_id);
        console.log("ClientID: ", res.data.client_id);
        // console.log('current client id: ', clientID ); value not print out as its not stored immediately in useState
      })
      .catch((err) => {
        console.log(err);
      });

    // Return a cleanup function to stop listening

    // *************************************************************************
  }, []);

  // function to load/rerender all data in table
  const load_all_data = () => {
    if (clientID != "") {
      setLoading(true);
      console.log("Page type: ", type);
      // load all the user's files
      // let client_file_id_url = `client/file/${clientID}`
      instance
        .get(`client/file/${clientID}`) // retrieve list of files under client_id
        .then((response) => {
          console.log(response.data);

          const data = response.data; // Assuming the response contains the data you provided

          const data_list = data.map((entry) => ({
            id: entry.file_id,
            fileName: entry.filename,
            userName: entry.client,
            timeStamp: entry.last_change,
            fileSize: entry.filesize,
            fileType: entry.filetype, // for download file insert extension type
          }));
          console.log("Data_list: ", data_list);
          setData(data_list);
          // console.log("Data: ", data); it wont load in immediately
          setLoading(false);
          console.log(
            "Data table retrieved list of files under client",
            clientID
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // load shared files
  const load_shared_files = () => {
    setLoading(true);
    console.log("Page type: ", type);
    // load all the user's files
    // let client_file_id_url = `client/file/${clientID}`
    instance
      .get(`sharedfile/toclient/${clientID}`) // retrieve files shared to client_id
      .then((response) => {
        console.log("Share response: ", response.data);

        const sharedData = response.data.results; // Assuming the response contains the data you provided

        const shared_list = sharedData.map((entry) => ({
          id: entry.file,
          fileName: entry.file__filename,
          userName: `${entry.client__u_id__f_name} ${entry.client__u_id__l_name}`,
          timeStamp: entry.create_time,
          fileType: entry.file__filetype, // for download file insert extension type
          share_id: entry.share_id, // for removing shared file
        }));
        console.log("Shared_list: ", shared_list);
        setData(shared_list);
        // console.log("Data: ", data); it wont load in immediately
        setLoading(false);
        console.log(
          "Shared table retrieved list of files under client",
          clientID
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const load_trashed_files = () => {
    setLoading(true);
    console.log("Page type: ", type);

    instance
      .get(`client/deleted/fileLogs/${clientID}`)
      .then((response) => {
        let trashedFilesList = response?.data || [];

        const trashed_list = trashedFilesList.map((entry) => ({
          id: entry.file_id,
          fileName: entry.filename,
          userName: entry.client_id,
          timeStamp: entry.delete_time,
          fileSize: entry.filesize,
        }));
        console.log("Trashed_list: ", trashed_list);
        setData(trashed_list);
        setLoading(false);
        console.log(
          "Trashed table retrieve list of files under client",
          clientID
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log("Client__ID: ", clientID);
    // switch between type of table to query
    switch (type) {
      case "users":
        break;
      case "files":
        load_all_data();
        break;
      case "shared":
        load_shared_files();
        break;
      case "trash":
        load_trashed_files();
        break;
      case "enquiries":
        break;
      default:
        break;
    }
  }, [clientID, type]);

  const handleUploadFiles = () => {};

  const customToolBar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <button
          class="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall css-1knaqv7-MuiButtonBase-root-MuiButton-root"
          onClick={handleUploadFiles}
        >
          <span class="MuiButton-startIcon MuiButton-iconSizeSmall css-y6rp3m-MuiButton-startIcon">
            <FileUploadIcon />
          </span>
          Upload Files
        </button>
      </GridToolbarContainer>
    );
  };

  // renders a three dot loading screen when data table is loading up
  // else data table is rendered successfully
  if (isLoading) {
    return (
      <div className="loadingContainer">
        <ThreeDots
          type="ThreeDots"
          color="#00b22d"
          height={100}
          width={100}
          //3 secs
        />
      </div>
    );
  } else {
    return (
      <div className="datatable">
        {/* https://react-hot-toast.com/ */}
        <Toaster toastOptions={{ duration: 3000 }} />
        <div className="datatableTitle">
          {/* Title of the datatable = Type with the first letter changed to upper case */}
          {type.replace(/^./, type[0].toUpperCase())}
          {/* <Link to={`/${type}/new`} className="link">
          Add New
        </Link> */}
        </div>
        {/* https://mui.com/x/react-data-grid/ */}
        <DataGrid
          className="datagrid"
          rows={data}
          columns={columns.concat(actionColumn)}
          slots={{
            toolbar: customToolBar,
          }} // https://mui.com/x/react-data-grid/filtering/
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[25, 50, 100]}
          checkboxSelection
        />
      </div>
    );
  }
};

export default Datatable;