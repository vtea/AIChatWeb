#!/bin/bash

# Check if running on a supported system
case "$(uname -s)" in
  Linux)
    echo "Running on Linux"
    ;;
  Darwin)
    echo "This script only works on Linux, not Mac OS."
    exit 1
    ;;
  *)
    echo "Unsupported operating system."
    exit 1
    ;;
esac

# check whether installed docker & compose

# Check if needed dependencies are installed and install if necessary
if ! command -v docker >/dev/null; then
  case "$(uname -s)" in
    Linux)
      echo "curl -o install-docker-v20.10.21.sh..."
      curl -o install-docker-v20.10.21.sh https://releases.rancher.com/install-docker/20.10.21.sh
      chmod +x install-docker-v20.10.21.sh
      ./install-docker-v20.10.21.sh

      # auto start on boot
      systemctl enable docker
      ;;
    Darwin)
      # /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
      # brew install node git yarn
      ;;
  esac
fi

systemctl start docker

# Check if jq is installed and install if necessary
if ! command -v jq >/dev/null; then
  echo "jq is not installed, installing now..."
  yum install -y jq
fi

# Check if /etc/docker/daemon.json exists and modify it
if [ -e /etc/docker/daemon.json ]; then
  echo "daemon.json exists, updating it..."
  jq '.["insecure-registries"] += ["harbor.nanjiren.online:8099"]' /etc/docker/daemon.json > /tmp/daemon.json && mv /tmp/daemon.json /etc/docker/daemon.json
else
  echo "daemon.json does not exist, creating it..."
  echo '{"insecure-registries": ["harbor.nanjiren.online:8099"]}' > /etc/docker/daemon.json
fi

# Restart Docker daemon
echo "Restarting Docker daemon..."
systemctl restart docker

# Prompt for AIChat Pro private registry credentials
DOCKER_REGISTRY_USERNAME="zsxq-common"
DOCKER_REGISTRY_PASSWORD="6i8J4XJHG4k4U6YjktQ"

echo "Logging in to Docker private registry..."
if docker login -u $DOCKER_REGISTRY_USERNAME -p $DOCKER_REGISTRY_PASSWORD http://harbor.nanjiren.online:8099; then
  echo "ProHub Login succeeded!"
else
  echo "ProHub Login failed!"
fi


# Clone the repository and install dependencies
echo "curl -o docker-compose.yml..."
curl -o docker-compose.yml https://raw.githubusercontent.com/Nanjiren01/AIChatWeb/pro/docker-compose.yml

# Setup AIChat super admin account
echo "#################### Setup super admin account ####################"
while true; do
    read -p "Please input the super admin username. Only letters and numbers are supported, the length should between 6 and 20, and they cannot start with a number: " SUPER_USERNAME
    regex='^[A-Za-z][A-Za-z0-9]{5,19}$'
    if [[ $SUPER_USERNAME =~ $regex ]]; then
        echo "Super Admin Username is valid."
        break
    else
        echo "Super Admin Username is invalid. Please try again."
    fi
done

while true; do
    read -p "Please input the super admin password. Only letters and numbers are supported, and the length should between 6 and 20. You can change it on the web page after the Application running: " SUPER_PASSWORD
    regex='^[A-Za-z0-9]{6,20}$'
    if [[ $SUPER_PASSWORD =~ $regex ]]; then
        echo "Super Admin Password is valid."
        break
    else
        echo "Super Admin Password is invalid. Please try again."
    fi
done

sed -i "s/SUPERADMIN_USERNAME:.*/SUPERADMIN_USERNAME: $SUPER_USERNAME/g" docker-compose.yml
sed -i "s/SUPERADMIN_PASSWORD:.*/SUPERADMIN_PASSWORD: $SUPER_PASSWORD/g" docker-compose.yml

echo "Super admin password has been updated successfully."

# Setup AIChat database password

DB_PASSWORD=$(openssl rand -base64 12)

echo "#################### Setup AIChat database password ####################"

sed -i "s/DB_PASSWORD:.*/DB_PASSWORD: $DB_PASSWORD/g" docker-compose.yml
sed -i "s/MYSQL_ROOT_PASSWORD:.*/MYSQL_ROOT_PASSWORD: $DB_PASSWORD/g" docker-compose.yml

echo "AIChat database password£º $DB_PASSWORD"
echo "AIChat Admin Username£º $SUPER_USERNAME"
echo "AIChat Admin password£º $SUPER_PASSWORD"

echo "Database password has been updated successfully."

# Pull images & Start
docker compose pull

docker compose up -d