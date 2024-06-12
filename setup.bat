@echo off

REM Variables
set RESOURCE_GROUP=your-resource-group
set LOCATION=your-location
set VNET_NAME=your-vnet-name
set VNET_ADDRESS_PREFIX=10.0.0.0/16
set SUBNET_APP_NAME=your-app-subnet-name
set SUBNET_DB_NAME=your-db-subnet-name
set SUBNET_APP_PREFIX=10.0.1.0/24
set SUBNET_DB_PREFIX=10.0.2.0/24
set NSG_NAME=your-nsg-name
set SQL_SERVER_NAME=10.0.0.183
set SQL_DATABASE_NAME=CBUReportDB
set CONTAINER_IMAGE=dbtest-copy-copy
set CONTAINER_NAMEdbtest-copy-copy
set DB_USER=IFRS_TEST
set DB_PASSWORD=Grace$58678









REM Create a resource group
az group create --name %RESOURCE_GROUP% --location %LOCATION%

REM Create a Virtual Network
az network vnet create --resource-group %RESOURCE_GROUP% --name %VNET_NAME% --address-prefix %VNET_ADDRESS_PREFIX%

REM Create subnets for the application and database
az network vnet subnet create --resource-group %RESOURCE_GROUP% --vnet-name %VNET_NAME% --name %SUBNET_APP_NAME% --address-prefix %SUBNET_APP_PREFIX%
az network vnet subnet create --resource-group %RESOURCE_GROUP% --vnet-name %VNET_NAME% --name %SUBNET_DB_NAME% --address-prefix %SUBNET_DB_PREFIX%

REM Create a Network Security Group
az network nsg create --resource-group %RESOURCE_GROUP% --name %NSG_NAME%

REM Associate NSG with the subnets
az network vnet subnet update --resource-group %RESOURCE_GROUP% --vnet-name %VNET_NAME% --name %SUBNET_APP_NAME% --network-security-group %NSG_NAME%
az network vnet subnet update --resource-group %RESOURCE_GROUP% --vnet-name %VNET_NAME% --name %SUBNET_DB_NAME% --network-security-group %NSG_NAME%

REM Add inbound security rules to NSG
az network nsg rule create --resource-group %RESOURCE_GROUP% --nsg-name %NSG_NAME% --name AllowAppPort --priority 100 --source-address-prefix VirtualNetwork --destination-address-prefix VirtualNetwork --destination-port-ranges 3010 --protocol Tcp --access Allow
az network nsg rule create --resource-group %RESOURCE_GROUP% --nsg-name %NSG_NAME% --name AllowSQLPort --priority 200 --source-address-prefix VirtualNetwork --destination-address-prefix VirtualNetwork --destination-port-ranges 1433 --protocol Tcp --access Allow

REM Configure the SQL Database to allow connections from the VNet
az sql server vnet-rule create --resource-group %RESOURCE_GROUP% --server %SQL_SERVER_NAME% --name AllowVNet --vnet-name %VNET_NAME% --subnet %SUBNET_DB_NAME%

REM Ensure the database allows Azure services to access it
az sql server firewall-rule create --resource-group %RESOURCE_GROUP% --server %SQL_SERVER_NAME% --name AllowAzureIPs --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0

REM Build the Docker image
docker build -t %CONTAINER_IMAGE% .

REM Run Docker container with the necessary environment variables
docker run -e DB_HOST=%SQL_SERVER_NAME%.database.windows.net -e DB_USER=%DB_USER% -e DB_PASSWORD=%DB_PASSWORD% -p 3010:3010 %CONTAINER_IMAGE%
