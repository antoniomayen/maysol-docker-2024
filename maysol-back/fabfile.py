from fabric.api import env, lcd, cd, run, prefix, local


def testing():
    env.key_filename = '~/.ssh/id_rsa'
    env.virtualenv = 'borderless'
    env.hosts = ['apps@test101.ciancoders.com']
    env.app_dir = 'apps/borderless/app/'
    env.home_dir = '/home/apps/'
    env.frontend_dir = 'apps/borderless/frontend/'
 
def sandbox():
    env.key_filename = '~/.ssh/id_rsa'
    env.virtualenv = 'sandbox'
    env.hosts = ['borderless@borderless-guatemala.com']
    env.app_dir = 'www/sandbox.borderless-guatemala.com/app'
    env.home_dir = '/home/borderless/'
    env.frontend_dir = 'www/sandbox.borderless-guatemala.com/frontend'

def production():
    env.key_filename = '~/.ssh/id_rsa'
    env.virtualenv = 'borderless'
    env.hosts = ['borderless@borderless-guatemala.com']
    env.app_dir = 'www/app.borderless-guatemala.com/app'
    env.home_dir = '/home/borderless/'
    env.frontend_dir = 'www/app.borderless-guatemala.com/frontend'

def elpinal():
    env.key_filename = '~/.ssh/id_rsa'
    env.virtualenv = 'elpinal'
    env.hosts = ['borderless@borderless-guatemala.com']
    env.app_dir = 'www/elpinal.borderless-guatemala.com/app'
    env.home_dir = '/home/borderless/'
    env.frontend_dir = 'www/elpinal.borderless-guatemala.com/frontend'

def elpinal():
    env.key_filename = '~/.ssh/id_rsa'
    env.virtualenv = 'elpinal'
    env.hosts = ['borderless@borderless-guatemala.com']
    env.app_dir = 'www/elpinal.borderless-guatemala.com/app'
    env.home_dir = '/home/borderless/'
    env.frontend_dir = 'www/elpinal.borderless-guatemala.com/frontend'


def deploy():
    """ Deploy hacia el host/ruta configurados"""
    # git pull
    # local('git reset --hard && git pull')

    # hosts

    backend_path = '{}:{}{}'.format(env.hosts[0], env.home_dir, env.app_dir)

    # upload backend
    local('rsync -r --info=progress2 --delete-after --exclude frontend --exclude .git --exclude maysol/local_settings.py --exclude \'*.pyc\' -z -e ssh . ' + backend_path)

    # build frontends
    frontends = [
        {'dir': 'frontend', 'remote_dir': env.frontend_dir}
    ]
    for f in frontends:
        print('build frontend ', f['dir'])
        with lcd(f['dir']):
            local('npm i')
            local('npm run build')
            # upload frontend
            with lcd('docroot'):
                frontend_path = '{}:{}{}'.format(
                    env.hosts[0], env.home_dir, f['remote_dir'])
                local(
                    'rsync -r --info=progress2 --delete-after -z -e ssh . ' + frontend_path)
            with cd(env.home_dir + f['remote_dir']):
                run('gzip -k --best --recursive *')

    # install backend
    with cd(env.home_dir + env.app_dir):
        with prefix('source /etc/bash_completion.d/virtualenvwrapper'):
            with prefix('workon {}'.format(env.virtualenv)):
                run('pip install --upgrade -r requirements.txt')
                run('python manage.py migrate')
                run('python manage.py collectstatic --noinput')
                run('touch maysol/local_settings.py')
