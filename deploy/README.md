- Install Ansible
- Install `Bessonov.docker` and `Bessonov.docker-compose` roles
  -- `ansible-galaxy install Bessonov.docker`
  -- `ansible-galaxy install Bessonov.docker-compose`
- Add curling host to Ansible inventory (`/usr/local/etc/ansible/hosts`)
  ```[curling]
  <host-ip>```
- Deploy the app with Ansible `env ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook playbook.yml  --private-key <PRIVATE_KEY_PATH> -e 'ansible_python_interpreter=/usr/bin/python3'`
