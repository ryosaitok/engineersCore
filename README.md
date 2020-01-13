# engineersCoreのLocalでの環境構築

## Python3系のインストール
<br>・$ brew install python
<br>・「$ python xxx」と打てばpython3系が実行されるようにPATH設定するなりエイリアス設定する

## MySQLのインストール
<br>・$ brew install mysql
<br>・パスを設定する。
<br>・engineersCoreという名前でデータベースを作成する。
<br>・mysql> create database engineersCore;

## Projectのclone
<br>・$ git clone git@github.com:ryosaitok/engineersCore.git

## MySQLのテーブル定義をするためにマイグレーション実行
<br>・$ cd engineersCore/engineers_core
<br>・$ python manage.py makemigrations
<br>・$ python manage.py migrate

## テストデータの投入
<br>・$ cd engineersCore
<br>・mysql> mysql -u {ユーザー名} -p engineersCore < test_data_insert.sql

## サーバーサイドのサーバー起動
<br>・$ cd engineersCore/engineers_core
<br>・$ python manage.py runserver
<br>・「 http://127.0.0.1:8000/admin/ 」でAdmin画面を開く。superuserは上の手順で作成済み。以下のユーザー名・パスワードでログインできるはず。
<br>・ユーザー名：testX
<br>・パスワード：password

## フロントエンドのビルド・サーバー起動
<br>・$ yarn install
<br>・$ npm start
<br>・「 http://localhost:4200/ 」にアクセスしてアプリケーションさわってみよう！
