#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "engineers_core.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

    try:
        if sys.argv[2] == "react":
            project_root = os.getcwd()
            os.chdir(os.path.join(project_root, "engineers_core_frontend"))
            os.system("yarn run build")
            os.chdir(project_root)
            sys.argv.pop(2)
        execute_from_command_line(sys.argv)
    except IndexError:
        execute_from_command_line(sys.argv)
    else:
        execute_from_command_line(sys.argv)