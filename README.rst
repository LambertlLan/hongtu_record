=====
Hongtu_record
=====

Polls is a simple Django app to conduct Web-based polls. For each
question, visitors can choose between a fixed number of answers.

Detailed documentation is in the "docs" directory.

Quick start
-----------

1. Add "polls" to your INSTALLED_APPS setting like this::

    INSTALLED_APPS = [
        ...
        'hongtu_record',
    ]

2. Include the polls URLconf in your project urls.py like this::

    url(r'^polls/', include('polls.urls')),

3. Run `python manage.py migrate` to create the polls models.

4. add "STATIC_ROOT = os.path.join(BASE_DIR, 'static')" in settings.py

5. python3 manage.py collectstatic

5. edit DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'hongtu_record',
        'HOST': "localhost",
        'PORT': "3306",
        'USER': "root",
        'PASSWORD': "lanyu0409"
        # 'PASSWORD': "hongtu123" # 服务器
    }
}

6. DEBUG = False

7. Start the development server and visit http://127.0.0.1:80/admin/
   to create a poll (you'll need the Admin app enabled).

8. Visit http://127.0.0.1:80/ to participate in the poll.