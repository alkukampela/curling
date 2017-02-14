- Install Ansible
- Install dependencies: `ansible-galaxy install -r requirements.yml`

- Deploy the app with Ansible `env ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook deploy.yml -i hosts --private-key <PRIVATE_KEY_PATH> -e 'ansible_python_interpreter=/usr/bin/python3'`
