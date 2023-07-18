# Generated by Django 4.1.4 on 2023-07-10 16:23

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Admintab",
            fields=[
                ("admin_id", models.AutoField(primary_key=True, serialize=False)),
            ],
            options={
                "db_table": "admintab",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Client",
            fields=[
                ("client_id", models.AutoField(primary_key=True, serialize=False)),
            ],
            options={
                "db_table": "client",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="DeleteFolderFileLogs",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("folder_files_id", models.IntegerField(blank=True, null=True)),
                ("file_id", models.UUIDField(blank=True, null=True)),
                ("folder_id", models.IntegerField(blank=True, null=True)),
                ("creation_time", models.DateTimeField(auto_now_add=True)),
                ("delete_time", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "db_table": "delete_folder_file_logs",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Encryption",
            fields=[
                (
                    "encryption_type",
                    models.CharField(max_length=20, primary_key=True, serialize=False),
                ),
            ],
            options={
                "db_table": "encryption",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="FileLog",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("file_id", models.UUIDField(blank=True, null=True)),
                ("folder_id", models.IntegerField(blank=True, null=True)),
                ("filename", models.CharField(blank=True, max_length=50, null=True)),
                ("filetype", models.CharField(blank=True, max_length=50, null=True)),
                ("numberofparts", models.IntegerField(blank=True, null=True)),
                (
                    "encryptiontype",
                    models.CharField(blank=True, max_length=50, null=True),
                ),
                ("client_id", models.IntegerField(blank=True, null=True)),
                ("file_version_id", models.UUIDField(blank=True, null=True)),
                ("uploadtime", models.DateTimeField(auto_now_add=True)),
                ("last_change", models.DateTimeField(auto_now=True)),
                ("delete_time", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "db_table": "file_log",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Fileparts",
            fields=[
                ("file_part_id", models.UUIDField(primary_key=True, serialize=False)),
                ("part_number", models.IntegerField(blank=True, null=True)),
                ("server_name", models.CharField(blank=True, max_length=50, null=True)),
                ("last_change", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "db_table": "fileparts",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="FilePartsLog",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("file_part_id", models.UUIDField(blank=True, null=True)),
                ("part_number", models.IntegerField(blank=True, null=True)),
                ("file_version_id", models.UUIDField(blank=True, null=True)),
                ("last_change", models.DateTimeField(blank=True, null=True)),
                ("file_id", models.UUIDField(blank=True, null=True)),
                ("delete_time", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "db_table": "file_parts_log",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Filesharehistory",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("client_id", models.IntegerField()),
                ("file_id", models.UUIDField(blank=True, null=True)),
                (
                    "permission_type",
                    models.CharField(blank=True, max_length=20, null=True),
                ),
                ("shared_client_id", models.IntegerField(blank=True, null=True)),
                ("create_time", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "db_table": "filesharehistory",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Filetable",
            fields=[
                (
                    "file_id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("filename", models.CharField(blank=True, max_length=50, null=True)),
                ("filetype", models.CharField(blank=True, max_length=50, null=True)),
                ("numberofparts", models.IntegerField(blank=True, null=True)),
                ("last_change", models.DateTimeField(auto_now=True)),
                ("uploadtime", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "db_table": "filetable",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="FileVersionLog",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("file_version_id", models.UUIDField(blank=True, null=True)),
                ("last_change", models.DateTimeField(blank=True, null=True)),
                ("file_id", models.UUIDField(blank=True, null=True)),
                ("file_version", models.IntegerField(blank=True, null=True)),
                ("delete_time", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "db_table": "file_version_log",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Folderfiles",
            fields=[
                (
                    "folder_files_id",
                    models.AutoField(primary_key=True, serialize=False),
                ),
                ("time_added", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "db_table": "folderfiles",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="FolderLogs",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("folder_id", models.IntegerField(blank=True, null=True)),
                ("client_id", models.IntegerField(blank=True, null=True)),
                ("foldername", models.CharField(blank=True, max_length=20, null=True)),
                ("creation_time", models.DateTimeField(blank=True, null=True)),
                ("last_change", models.DateTimeField(blank=True, null=True)),
                ("delete_time", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "db_table": "folder_logs",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Foldersharehistory",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("client_id", models.IntegerField()),
                ("folder_id", models.IntegerField()),
                (
                    "permission_type",
                    models.CharField(blank=True, max_length=20, null=True),
                ),
                ("shared_client_id", models.IntegerField(blank=True, null=True)),
                ("create_time", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "db_table": "foldersharehistory",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Foldertable",
            fields=[
                ("folder_id", models.AutoField(primary_key=True, serialize=False)),
                ("foldername", models.CharField(blank=True, max_length=50, null=True)),
                ("creation_time", models.DateTimeField(auto_now_add=True)),
                ("last_change", models.DateTimeField(auto_now=True)),
            ],
            options={
                "db_table": "foldertable",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Invoice",
            fields=[
                ("invoice_id", models.IntegerField(primary_key=True, serialize=False)),
                ("price", models.IntegerField(blank=True, null=True)),
                ("date", models.DateTimeField(auto_now_add=True)),
                ("pay_date", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "db_table": "invoice",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Permission",
            fields=[
                (
                    "permission_type",
                    models.CharField(max_length=50, primary_key=True, serialize=False),
                ),
            ],
            options={
                "db_table": "permission",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Server1",
            fields=[
                ("file_id", models.UUIDField()),
                (
                    "file_version_id",
                    models.UUIDField(primary_key=True, serialize=False),
                ),
            ],
            options={
                "db_table": "server1",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Server1Logs",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("file_version_id", models.UUIDField(blank=True, null=True)),
                ("file_id", models.UUIDField(blank=True, null=True)),
                ("file_part_id", models.UUIDField(blank=True, null=True)),
                ("delete_time", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "db_table": "server1_logs",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Server2",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("file_id", models.UUIDField()),
                ("file_version_id", models.UUIDField(blank=True, null=True)),
            ],
            options={
                "db_table": "server2",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Server2Logs",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("file_version_id", models.UUIDField(blank=True, null=True)),
                ("file_id", models.UUIDField(blank=True, null=True)),
                ("file_part_id", models.UUIDField(blank=True, null=True)),
                ("delete_time", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "db_table": "server2_logs",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Server3",
            fields=[
                ("file_id", models.UUIDField()),
                (
                    "file_version_id",
                    models.UUIDField(primary_key=True, serialize=False),
                ),
            ],
            options={
                "db_table": "server3",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Server3Logs",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("file_version_id", models.UUIDField(blank=True, null=True)),
                ("file_id", models.UUIDField(blank=True, null=True)),
                ("file_part_id", models.UUIDField(blank=True, null=True)),
                ("delete_time", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "db_table": "server3_logs",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Server4",
            fields=[
                ("file_id", models.UUIDField(primary_key=True, serialize=False)),
                ("file_version_id", models.UUIDField()),
            ],
            options={
                "db_table": "server4",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Server4Logs",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("file_version_id", models.UUIDField(blank=True, null=True)),
                ("file_id", models.UUIDField(blank=True, null=True)),
                ("file_part_id", models.UUIDField(blank=True, null=True)),
                ("delete_time", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "db_table": "server4_logs",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Sharedfileaccess",
            fields=[
                ("share_id", models.AutoField(primary_key=True, serialize=False)),
                ("shared_client_id", models.IntegerField(blank=True, null=True)),
                ("create_time", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "db_table": "sharedfileaccess",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Sharedfolderaccess",
            fields=[
                ("share_id", models.AutoField(primary_key=True, serialize=False)),
                ("shared_client_id", models.IntegerField(blank=True, null=True)),
                ("create_time", models.DateTimeField(auto_now_add=True)),
            ],
            options={
                "db_table": "sharedfolderaccess",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Subscription",
            fields=[
                (
                    "subscriptiontype",
                    models.CharField(max_length=20, primary_key=True, serialize=False),
                ),
                ("price", models.IntegerField(blank=True, null=True)),
                (
                    "data_allocated",
                    models.CharField(blank=True, max_length=20, null=True),
                ),
                ("shards", models.IntegerField(blank=True, null=True)),
            ],
            options={
                "db_table": "subscription",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Users",
            fields=[
                ("user_id", models.AutoField(primary_key=True, serialize=False)),
                ("username", models.CharField(max_length=50)),
                ("pssword", models.CharField(max_length=50)),
                ("f_name", models.CharField(max_length=50)),
                ("l_name", models.CharField(max_length=50)),
                ("email", models.CharField(max_length=50)),
            ],
            options={
                "db_table": "users",
                "managed": False,
            },
        ),
        migrations.CreateModel(
            name="Fileversion",
            fields=[
                (
                    "file_version",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        primary_key=True,
                        serialize=False,
                        to="app.filetable",
                    ),
                ),
                ("file_id", models.UUIDField(blank=True, null=True)),
                (
                    "file_version_0",
                    models.IntegerField(
                        blank=True, db_column="file_version", null=True
                    ),
                ),
                ("last_change", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "db_table": "fileversion",
                "managed": False,
            },
        ),
    ]
