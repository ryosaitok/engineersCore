# Generated by Django 2.0.6 on 2019-04-02 13:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('engineers_core_api', '0016_auto_20190331_1746'),
    ]

    operations = [
        migrations.CreateModel(
            name='BookAuthor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engineers_core_api.Author')),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engineers_core_api.Book')),
            ],
        ),
    ]
