# Generated by Django 2.1 on 2019-04-24 15:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AmazonBook',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_asin', models.CharField(db_index=True, max_length=64)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author_name', models.CharField(db_index=True, max_length=128)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(db_index=True, max_length=255)),
                ('book_status', models.CharField(choices=[['PRE', 'Pre-Sales'], ['PUB', 'Published'], ['OOP', 'Out Of Print']], default='PUB', max_length=10)),
                ('sale_date', models.DateField(null=True)),
                ('pages_count', models.IntegerField()),
                ('offer_price', models.IntegerField(null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='BookAuthor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engineers_core_app.Author')),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engineers_core_app.Book')),
            ],
        ),
        migrations.CreateModel(
            name='BookComment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment_text', models.TextField(max_length=10000)),
                ('comment_date', models.DateField(auto_now=True)),
                ('tweet_flag', models.BooleanField(default=False)),
                ('delete_flag', models.BooleanField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engineers_core_app.Book')),
            ],
        ),
        migrations.CreateModel(
            name='BookDetail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('summary', models.TextField(max_length=10000)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engineers_core_app.Book')),
            ],
        ),
        migrations.CreateModel(
            name='CommentFavorite',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('favorite_date', models.DateField(auto_now=True)),
                ('delete_flag', models.BooleanField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('comment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engineers_core_app.BookComment')),
            ],
        ),
        migrations.CreateModel(
            name='InterestedBook',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('interested_date', models.DateField(auto_now=True)),
                ('delete_flag', models.BooleanField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engineers_core_app.Book')),
            ],
        ),
        migrations.CreateModel(
            name='ReadBook',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('read_date', models.DateField(null=True)),
                ('delete_flag', models.BooleanField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engineers_core_app.Book')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.CharField(max_length=128)),
                ('account_name', models.CharField(db_index=True, max_length=128, unique=True)),
                ('description', models.TextField(max_length=512, null=True)),
                ('profile_image_link', models.ImageField(null=True, unique=True, upload_to='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.AddField(
            model_name='readbook',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engineers_core_app.User'),
        ),
        migrations.AddField(
            model_name='interestedbook',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engineers_core_app.User'),
        ),
        migrations.AddField(
            model_name='commentfavorite',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engineers_core_app.User'),
        ),
        migrations.AddField(
            model_name='bookcomment',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='engineers_core_app.User'),
        ),
        migrations.AddField(
            model_name='amazonbook',
            name='book',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='amazon_book', to='engineers_core_app.Book'),
        ),
        migrations.AlterUniqueTogether(
            name='interestedbook',
            unique_together={('user', 'book')},
        ),
        migrations.AlterUniqueTogether(
            name='commentfavorite',
            unique_together={('user', 'comment')},
        ),
        migrations.AlterUniqueTogether(
            name='bookauthor',
            unique_together={('book', 'author')},
        ),
    ]