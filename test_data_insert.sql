-- AUTH_USERデータ
INSERT INTO auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
  VALUES (1, 'pbkdf2_sha256$120000$QfxGMcxuSeQ3$nK589TlyZLNTVFHL/O+9o6s7d88JAHrndAH5VEtoKmo=', now(), 1, 'virtual_techX', 'サーファー', '仮想', 'jinko.chinoxxx@gmail.com', 1, 1, now());
INSERT INTO auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
  VALUES (2, 'pbkdf2_sha256$120000$uxmLs3hwY5cO$zT8MZ/h8BXKMEaXmg9UcwzitFWq77T3cZtEtM2kAfiQ=', now(), 0, 'business_techX', '複業実験室', '仮想サーファー', 'test1@example.com', 0, 1, now());
INSERT INTO auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
  VALUES (3, 'pbkdf2_sha256$120000$uxmLs3hwY5cO$zT8MZ/h8BXKMEaXmg9UcwzitFWq77T3cZtEtM2kAfiQ=', now(), 0, 'muscle_techX', 'サーファー', '駆け出し', 'test2@example.com', 0, 1, now());
INSERT INTO auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
  VALUES (4, 'pbkdf2_sha256$120000$uxmLs3hwY5cO$zT8MZ/h8BXKMEaXmg9UcwzitFWq77T3cZtEtM2kAfiQ=', now(), 0, 'cryptoNewsBot', 'ニュース', '仮想通貨', 'test3@example.com', 0, 1, now());
INSERT INTO auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
  VALUES (5, 'pbkdf2_sha256$120000$uxmLs3hwY5cO$zT8MZ/h8BXKMEaXmg9UcwzitFWq77T3cZtEtM2kAfiQ=', now(), 0, 'tarotaro', '太郎', '田中', 'test4@example.com', 0, 1, now());
INSERT INTO auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
  VALUES (6, 'pbkdf2_sha256$120000$uxmLs3hwY5cO$zT8MZ/h8BXKMEaXmg9UcwzitFWq77T3cZtEtM2kAfiQ=', now(), 0, 'jiro_love', '二郎', '山田', 'test5@example.com', 0, 1, now());
INSERT INTO auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
  VALUES (7, 'pbkdf2_sha256$120000$uxmLs3hwY5cO$zT8MZ/h8BXKMEaXmg9UcwzitFWq77T3cZtEtM2kAfiQ=', now(), 0, '777', 'ナ', 'ナナ', 'test6@example.com', 0, 1, now());
INSERT INTO auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
  VALUES (8, 'pbkdf2_sha256$120000$uxmLs3hwY5cO$zT8MZ/h8BXKMEaXmg9UcwzitFWq77T3cZtEtM2kAfiQ=', now(), 0, 'tech_party', '開催したい', '技術書展', 'test7@example.com', 0, 1, now());
INSERT INTO auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
  VALUES (9, 'pbkdf2_sha256$120000$uxmLs3hwY5cO$zT8MZ/h8BXKMEaXmg9UcwzitFWq77T3cZtEtM2kAfiQ=', now(), 0, 'python_now', '学習中', 'Python', 'test8@example.com', 0, 1, now());

-- USERデータ
INSERT INTO user (id, user_name, account_name, description, profile_image_link, created_at, updated_at, auth_user_id)
  VALUES (1, '仮想サーファー', 'virtual_techX', 'Webエンジニア@ベンチャー | 日常生活の作業を自動化(さぼる) | 雑記ブログ月間10万PV(http://www.virtual-surfer.com ) | プログラミングチュートリアル(https://note.mu/virtual_surfer ) | 複業(@business_techX)', '1_virtual_techX.png', now(), now(), 1);
INSERT INTO user (id, user_name, account_name, description, profile_image_link, created_at, updated_at, auth_user_id)
  VALUES (2, '仮想サーファー@複業実験室', 'business_techX', '複業で学んだことをつぶやく', null, now(), now(), 2);
INSERT INTO user (id, user_name, account_name, description, profile_image_link, created_at, updated_at, auth_user_id)
  VALUES (3, '駆け出しサーファー', 'muscle_techX', '元駆け出しエンジニアマッチョになるまでの記録', null, now(), now(), 3);
INSERT INTO user (id, user_name, account_name, description, profile_image_link, created_at, updated_at, auth_user_id)
  VALUES (4, '仮想通貨ニュース', 'cryptoNewsBot', '仮想通貨のニュース情報を呟き続けるBotです', null, now(), now(), 4);
INSERT INTO user (id, user_name, account_name, description, profile_image_link, created_at, updated_at, auth_user_id)
  VALUES (5, '田中太郎', 'tarotaro', '世田谷で働く営業マン', null, now(), now(), 5);
INSERT INTO user (id, user_name, account_name, description, profile_image_link, created_at, updated_at, auth_user_id)
  VALUES (6, '山田二郎', 'jiro_love', '二郎系ラーメンをこよなく愛するマン', null, now(), now(), 6);
INSERT INTO user (id, user_name, account_name, description, profile_image_link, created_at, updated_at, auth_user_id)
  VALUES (7, 'ナナナ', '777', '平成7年7月7日生まれ7歳児（←）', '7_777.png', now(), now(), 7);
INSERT INTO user (id, user_name, account_name, description, profile_image_link, created_at, updated_at, auth_user_id)
  VALUES (8, '技術書展開催したい', 'tech_party', 'いつか技術書展を開催したい', null, now(), now(), 8);
INSERT INTO user (id, user_name, account_name, description, profile_image_link, created_at, updated_at, auth_user_id)
  VALUES (9, 'Python学習中', 'python_now', 'pythonを勉強中の高校生', null, now(), now(), 9);

-- AUTHORデータ
INSERT INTO author (id, author_name, created_at, updated_at)
  VALUES (1, '吉田裕美', now(), now());
INSERT INTO author (id, author_name, created_at, updated_at)
  VALUES (2, 'Stoyan Stefanov', now(), now());
INSERT INTO author (id, author_name, created_at, updated_at)
  VALUES (3, '三宅 英明', now(), now());
INSERT INTO author (id, author_name, created_at, updated_at)
  VALUES (4, 'Dustin Boswell', now(), now());
INSERT INTO author (id, author_name, created_at, updated_at)
  VALUES (5, 'Trevor Foucher', now(), now());
INSERT INTO author (id, author_name, created_at, updated_at)
  VALUES (6, '矢沢 久雄', now(), now());
INSERT INTO author (id, author_name, created_at, updated_at)
  VALUES (7, '米持 幸寿', now(), now());
INSERT INTO author (id, author_name, created_at, updated_at)
  VALUES (8, '平澤 章', now(), now());
INSERT INTO author (id, author_name, created_at, updated_at)
  VALUES (9, '山本 陽平', now(), now());

-- BOOKデータ
INSERT INTO book (id, title, sale_date, pages_count, offer_price, created_at, updated_at, book_status)
  VALUES (1, '作りながら学ぶ React入門', '2017-09-16', 216, 2160, now(), now(), 'PUB');
INSERT INTO book (id, title, sale_date, pages_count, offer_price, created_at, updated_at, book_status)
  VALUES (2, 'Reactビギナーズガイド ―コンポーネントベースのフロントエンド開発入門', '2017-03-11', 248, 2700, now(), now(), 'PUB');
INSERT INTO book (id, title, sale_date, pages_count, offer_price, created_at, updated_at, book_status)
  VALUES (3, '新しいLinuxの教科書', '2015-06-06', 440, 2916, now(), now(), 'PUB');
INSERT INTO book (id, title, sale_date, pages_count, offer_price, created_at, updated_at, book_status)
  VALUES (4, 'リーダブルコード ―より良いコードを書くためのシンプルで実践的なテクニック', '2012-06-23', 260, 2592, now(), now(), 'PUB');
INSERT INTO book (id, title, sale_date, pages_count, offer_price, created_at, updated_at, book_status)
  VALUES (5, 'プログラムはなぜ動くのか　第２版　知っておきたいプログラムの基礎知識', null, 296, 2592, now(), now(), 'PUB');
INSERT INTO book (id, title, sale_date, pages_count, offer_price, created_at, updated_at, book_status)
  VALUES (6, 'コンピュータはなぜ動くのか～知っておきたいハードウエア＆ソフトウエアの基礎知識', '2003-06-02', 2592, 277, now(), now(), 'PUB');
INSERT INTO book (id, title, sale_date, pages_count, offer_price, created_at, updated_at, book_status)
  VALUES (7, 'Javaでなぜつくるのか 知っておきたいJavaプログラミングの基礎知識', '2005-03-31', 309, 2592, now(), now(), 'PUB');
INSERT INTO book (id, title, sale_date, pages_count, offer_price, created_at, updated_at, book_status)
  VALUES (8, 'オブジェクト指向でなぜつくるのか 第2版', '2011-04-07', 368, 2592, now(), now(), 'PUB');
INSERT INTO book (id, title, sale_date, pages_count, offer_price, created_at, updated_at, book_status)
  VALUES (9, 'Webを支える技術 -HTTP、URI、HTML、そしてREST ', '2010-04-08', 400, 2776, now(), now(), 'PUB');

-- BOOK_AUTHORデータ
INSERT INTO book_author (id, created_at, updated_at, author_id, book_id)
  VALUES (1, now(), now(), 1, 1);
INSERT INTO book_author (id, created_at, updated_at, author_id, book_id)
  VALUES (2, now(), now(), 2, 2);
INSERT INTO book_author (id, created_at, updated_at, author_id, book_id)
  VALUES (3, now(), now(), 3, 3);
INSERT INTO book_author (id, created_at, updated_at, author_id, book_id)
  VALUES (4, now(), now(), 4, 4);
INSERT INTO book_author (id, created_at, updated_at, author_id, book_id)
  VALUES (5, now(), now(), 5, 4);
INSERT INTO book_author (id, created_at, updated_at, author_id, book_id)
  VALUES (6, now(), now(), 6, 5);
INSERT INTO book_author (id, created_at, updated_at, author_id, book_id)
  VALUES (7, now(), now(), 6, 6);
INSERT INTO book_author (id, created_at, updated_at, author_id, book_id)
  VALUES (8, now(), now(), 7, 7);
INSERT INTO book_author (id, created_at, updated_at, author_id, book_id)
  VALUES (9, now(), now(), 8, 8);
INSERT INTO book_author (id, created_at, updated_at, author_id, book_id)
  VALUES (10, now(), now(), 9, 9);

-- AMAZON_BOOKデータ
INSERT INTO amazon_book (id, data_asin, created_at, updated_at, book_id)
  VALUES (1, '479805075X', now(), now(), 1);
INSERT INTO amazon_book (id, data_asin, created_at, updated_at, book_id)
  VALUES (2, '4873117887', now(), now(), 2);
INSERT INTO amazon_book (id, data_asin, created_at, updated_at, book_id)
  VALUES (3, '4797380942', now(), now(), 3);
INSERT INTO amazon_book (id, data_asin, created_at, updated_at, book_id)
  VALUES (4, '4873115655', now(), now(), 4);
INSERT INTO amazon_book (id, data_asin, created_at, updated_at, book_id)
  VALUES (5, '4822283151', now(), now(), 5);
INSERT INTO amazon_book (id, data_asin, created_at, updated_at, book_id)
  VALUES (6, '4822281655', now(), now(), 6);
INSERT INTO amazon_book (id, data_asin, created_at, updated_at, book_id)
  VALUES (7, '4822281965', now(), now(), 7);
INSERT INTO amazon_book (id, data_asin, created_at, updated_at, book_id)
  VALUES (8, '4822284654', now(), now(), 8);
INSERT INTO amazon_book (id, data_asin, created_at, updated_at, book_id)
  VALUES (9, '4774142042', now(), now(), 9);

-- BOOK_DETAILデータ
INSERT INTO book_detail (id, summary, created_at, updated_at, book_id)
  VALUES (1, '2013年にFacebook社によって公開されたJavaScriptライブラリーがReact(React.js)です。仮想DOMによる高速表示、コンポーネント指向による高いメンテナンス性といった特長からFacebookだけでなく、Instagram、Airbnbなどの大規模Webサービスでも採用されています。本書は、簡単なじゃんけんアプリを作りながら学べるReactの入門書です。開発環境構築も詳述しましたので、JavaScript(ES6)への移行を目指す人にも最適です!', now(), now(), 1);
INSERT INTO book_detail (id, summary, created_at, updated_at, book_id)
  VALUES (2, 'ReactによるコンポーネントベースのWebフロントエンド開発の入門書。
Reactでは小さくて管理が容易なコンポーネントを組み合わせて、大きくて強力なアプリケーションを作成できます。
本書の前半は入門編で、簡単なサンプルを使いながらReactの基本やJSXについて学びます。
後半は、実際のアプリケーション開発に必要なものや開発を助けてくれるツールについての解説です。
具体的には、JavaScriptのパッケージングツール(Browserify)、ユニットテスト(Jest)、構文チェック(ESLint)、型チェック(Flow)、データフローの最適化(Flux)、イミュータブルなデータ(immutableライブラリ)などを取り上げます。
対象読者は、ES2015(ES6)の基本をマスターしているフロントエンド開発者。', now(), now(), 2);
INSERT INTO book_detail (id, summary, created_at, updated_at, book_id)
  VALUES (3, '【8刷、ベストセラー】 コマンドラインを極めろ!!

MS-DOSを知らない世代のエンジニアに向けたLinux入門書の決定版。
Linux自身の機能だけでなく、シェルスクリプトを使ったプログラミングや、
Gitによるソフトウェア開発のバージョン管理など、イマドキのエンジニアなら
知っておくべき知識についても、丁寧に解説しました!!

Redhat系、Debian系に対応

CHAPTER01 Linuxを使ってみよう
CHAPTER02 シェルって何だろう?
CHAPTER03 シェルの便利な機能
CHAPTER04 ファイルとディレクトリ
CHAPTER05 ファイル操作の基本
CHAPTER06 探す、調べる
CHAPTER07 テキストエディタ
CHAPTER08 bashの設定
CHAPTER09 ファイルパーミッションとスーパーユーザ
CHAPTER10 プロセスとジョブ
CHAPTER11 標準入出力とパイプライン
CHAPTER12 テキスト処理
CHAPTER13 正規表現
CHAPTER14 高度なテキスト処理
CHAPTER15 シェルスクリプトを書こう
CHAPTER16 シェルスクリプトの基礎知識
CHAPTER17 シェルスクリプトを活用しよう
CHAPTER18 アーカイブと圧縮
CHAPTER19 バージョン管理システム
CHAPTER20 ソフトウェアパッケージ
APPENDIX 01 リモートログインとSSH
02 infoドキュメントを読む
03 Linuxと日本語入力
04 参考文献 ', now(), now(), 3);
INSERT INTO book_detail (id, summary, created_at, updated_at, book_id)
  VALUES (4, '「美しいコードを見ると感動する。優れたコードは見た瞬間に何をしているかが伝わってくる。そういうコードは使うのが楽しいし、
自分のコードもそうあるべきだと思わせてくれる。本書の目的は、君のコードを良くすることだ」(本書「はじめに」より)。

コードは理解しやすくなければならない。本書はこの原則を日々のコーディングの様々な場面に当てはめる方法を紹介します。
名前の付け方、コメントの書き方など表面上の改善について。コードを動かすための制御フロー、論理式、変数などループとロジックについて。
またコードを再構成するための方法。さらにテストの書き方などについて、楽しいイラストと共に説明しています。

日本語版ではRubyやgroongaのコミッタとしても著名な須藤功平氏による解説を収録。', now(), now(), 4);
INSERT INTO book_detail (id, summary, created_at, updated_at, book_id)
  VALUES (5, '●『プログラムはなぜ動くのか』６年ぶり、待望の改訂第2版！

プログラムがコンピュータの中でどのように動作するのかを、誰にでもわかるように説明しました。プログラムは、メモリーにロードされ、CPUによって解釈・実行されます。その仕組みを、多数の図を使って、順序だてて解説していきます。

第2版では、第1版で特に関心の高かったプログラムがメモリーをどう利用しているかについて、より丁寧な説明を加えたほか、多くの注釈を入れました。また、サンプル・プログラムを、第1版のVisual Basicからプログラムの動きが見えやすいC言語に統一し、巻末にC言語の構文を説明した補章を追加しました。初級者、中級者の人、どちらにもお勧めです。

特徴1：CPU、メモリー、プログラムの動作環境など・・基礎からきちんと解説！
CPU（プロセサ）はどうやってプログラムを動かしているの？　 CPUとメモリーの関係は？　どうやってディスプレイに表示されるの？　など基礎的な部分からきちんと説明しています。

特徴2：メモリーについて充実した説明！
第１版でなんといっても多かったのが「プログラムがメモリーをどう使っているのかがわかって、自分のプログラムの動きがわかった！」という声でした。第２版では、メモリーの使い方についての説明を強化しました。関数や変数、ポインタや配列は、どうメモリー領域を使っているのかをぜひ知ってください。

特徴3：Windowsの仕組みわかる！
プログラムの動く仕組みを知るとは、Windowsの仕組みを知ることにもつながります。フリーソフトをインストールしたときに出会うDLLファイルや、EXEファイルは、その実体は何だろう、と感じるパソコンユーザーも多いはずです。本書は、プログラミング本ではありません。豊富な図表を使って、その仕組みや流れが感覚的にとらえられるようにしています。', now(), now(), 5);
INSERT INTO book_detail (id, summary, created_at, updated_at, book_id)
  VALUES (6, '本質がわかる“なぜ"シリーズ第4弾!
ベストセラー『プログラムはなぜ動くのか』の著者 矢沢久雄氏 待望の最新作。
本書はベストセラー『プログラムはなぜ動くのか』の姉妹本として、この1冊だけ読んでも理解できる、わかりやすい内容です。前作ではとり上げなかった「アルゴリズム」「オブジェクト指向」「データベース」「ネットワーク」「セキュリティ」など、コンピュータの中のしくみを“誌上での実験"を通してわかりやすく解説しています。

-------------------------------------------------
   企業セミナーの講師である著者は、近年の技術者の技術に対する興味が驚くほど少ないと感じ、そのことを憂慮している。著者はその原因を、コンピュータがわからなくなっている、すなわち技術が多様化と共にブラックボックス化し、その結果、技術に対して興味を失ったり、不安になったりしていると考えている。本質を理解することによって、技術への興味を回復し、新技術へ挑んでいくための礎とすることが本書の趣旨だ。

   内容的には、入力・演算・出力から始まり、ハードウェアとソフトウェア、プログラミング、データベース、ネットワーク、SEの業務知識と、コンピュータの初等教育で扱われる内容をほぼひととおり網羅している。確かに、新入社員研修でもそのまま使える内容ではあるのだが、用語をできる限り並べるようないわゆる「テキスト」とは異なり、コンピュータを理解するうえで重要なポイントをできるだけ掘り下げようとしている姿勢が大きな特徴と言えるだろう。例えば、ハードウェアの説明をするために、回路図の読み方やCPUのピンの役割まで解説する。その一方でオブジェクト指向プログラミングやXMLなど新しい技術もわかりやすく説明しているので、レガシーな知識をバランスよく習得していけるようになっている。

   基礎知識を持たない新人文系SEにも最適だが、受験勉強で年号だけを覚えるような虚しさを技術に対して抱いてしまっているベテランにも、高校の教科書を読み返すような感覚で目を通してほしい。(大脇太一)', now(), now(), 6);
INSERT INTO book_detail (id, summary, created_at, updated_at, book_id)
  VALUES (7, '＜＜“なぜ”シリーズ　第6弾！！＞＞
Javaがなぜここまで支持され普及しているでしょうか？　単にオブジェクト指向プログラミング言語だから、というのだけでは語りつくせないJavaの魅力を、言語やメモリー管理のしくみやプログラミングの特性に加え、Javaを取り巻く環境などから解説します。これまで誰も語らなかったJavaの本質を、「なぜ」シリーズならではのは、内容は深いけれど、わかりやすい文章で丁寧に説明します。そして最後に「Javaに前向きに取り組むには」「伝わっていないJavaの魅力」「Javaが本当に目指すもの」にも触れます。エンジニアだけでなく、IT業界に携わるすべての人に贈る一冊です。', now(), now(), 7);
INSERT INTO book_detail (id, summary, created_at, updated_at, book_id)
  VALUES (8, '●『オブジェクト指向でなぜつくるのか』7年ぶり、待望の改訂第2版！

現在のソフトウエア開発技術の主役である、オブジェクト指向の全体像とそこに含まれる各技術を
平易な文章で核心をズバリと解説します。

改訂第2版では、すべての文章を細かく見直して修正して、追加のトピックを記述したことに加えて、
多くの技術者の注目を集めている関数型言語の基本的な仕組みと思想を解説する
「第13章 関数型言語でなぜつくるのか」を新たに書き下ろしています。

◆オブジェクト指向の全体像を整理して解説
オブジェクト指向は、プログラミングをはじめ、フレームワーク、デザインパターン、UML、モデリング、
設計、アジャイル開発手法と、ソフトウエア開発全体を支える総合技術となっています。
本書では、オブジェクト指向の全体像とそこに含まれる各技術が何を目的として何を実現するのかを解説します。
併せて、混乱を避けるために全体を「プログラミング技術」と「汎用の整理術」の2つに分けて説明します。

◆OOPのプログラムが動く仕組みがわかる
OOPで書いたプログラムは、特有のメモリの使い方をします。
本書では静的領域、ヒープ領域、スタック領域に対して、クラスやインスタンスや変数がどのように配置され管理されて
いるのかを多数の図を使って説明します。これらを理解することで、自分の書いたプログラムがどのように
動いているのがイメージできるようになります。

◆関数型言語の本質がわかる
オブジェクト指向の「次」の技術として注目される関数型言語は、従来のプログラミング言語とは基本的な
仕組みや考え方が大きく異なっています。本書では関数型言語の仕組みを7つの特徴に分けて説明するとともに、
オブジェクト指向との関係についても述べます。', now(), now(), 8);
INSERT INTO book_detail (id, summary, created_at, updated_at, book_id)
  VALUES (9, 'Webは誕生から20年で爆発的な普及を果たし,17億人のユーザと2億台のサーバを抱える巨大システムへと成長しました。Webがここまで成功した秘密は,その設計思想,いわゆるアーキテクチャにあります。Webのアーキテクチャ,そしてHTTP,URI,HTMLといったWebを支える技術は,Webがどんなに巨大化しても対応できるように設計されていたのです。
私たちが作る個々のWebサービスも,Webのアーキテクチャにのっとることで成功へとつながります。Webのアーキテクチャに正しく適応したWebサービスは,情報が整理され,ユーザの使い勝手が向上し,ほかのサービスと連携しやすくなり,将来的な拡張性が確保されるからです。
本書のテーマは,Webサービスの実践的な設計です。まずHTTPやURI,HTMLなどの仕様を歴史や設計思想を織り交ぜて解説します。そしてWebサービスにおける設計課題,たとえば望ましいURI,HTTPメソッドの使い分け,クライアントとサーバの役割分担,設計プロセスなどについて,現時点のベストプラクティスを紹介します。', now(), now(), 9);

-- BOOK_COMMENTデータ
INSERT INTO book_comment (id, comment_text, comment_date, read_date, tweet_flag, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (1, 'Reactの超基本的なことを学べる本。ある程度Reactを書いたことがある人は読者対象ではなさそう。', CURRENT_DATE(), '2019-05-02', FALSE, FALSE, now(), now(), 1, 1);
INSERT INTO book_comment (id, comment_text, comment_date, read_date, tweet_flag, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (2, 'Reactの中級者向けの本として読んだ！ちょっと理解できてないところもあるから再読したい...', CURRENT_DATE(), '2019-05-03', FALSE, FALSE, now(), now(), 2, 1);
INSERT INTO book_comment (id, comment_text, comment_date, read_date, tweet_flag, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (3, 'Linuxコマンドはエンジニアとして働くなら絶対触ることになるし、このタイミングで教科書的に学べたのはとてもよかった。', '2019-03-01', '2019-05-04', TRUE, FALSE, now(), now(), 3, 1);
INSERT INTO book_comment (id, comment_text, comment_date, read_date, tweet_flag, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (4, 'コマンド忘れすぎてて再読。
割とすぐに忘れてしまってて辛い...', '2019-04-02', '2019-05-05', TRUE, FALSE, now(), now(), 3, 1);
INSERT INTO book_comment (id, comment_text, comment_date, read_date, tweet_flag, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (5, 'エンジニア初期に読んだけど久しぶりに読んだ。今読むと違う気づきがあっておもしろい。', CURRENT_DATE(), '2019-05-06', FALSE, FALSE, now(), now(), 4, 1);
INSERT INTO book_comment (id, comment_text, comment_date, read_date, tweet_flag, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (6, '基礎的な仕組み関して学べる', CURRENT_DATE(), '2019-05-07', FALSE, FALSE, now(), now(), 6, 2);
INSERT INTO book_comment (id, comment_text, comment_date, read_date, tweet_flag, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (7, 'なぜJavaを使うのか？勉強になる。', CURRENT_DATE(), '2019-05-08', FALSE, FALSE, now(), now(), 7, 3);
INSERT INTO book_comment (id, comment_text, comment_date, read_date, tweet_flag, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (8, 'オブジェクト指向しか知らないと持てない視点を学べた！良い本〜', CURRENT_DATE(), '2019-05-09', FALSE, FALSE, now(), now(), 8, 4);
INSERT INTO book_comment (id, comment_text, comment_date, read_date, tweet_flag, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (9, 'これはエンジニア研修とかで全員に読ませるべきやつなのでは。', CURRENT_DATE(), '2019-05-10', FALSE, FALSE, now(), now(), 9, 5);

-- COMMENT_FAVORITEデータ
INSERT INTO comment_favorite (id, favorite_date, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (1, CURRENT_DATE(), FALSE, now(), now(), 1, 1);
INSERT INTO comment_favorite (id, favorite_date, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (2, CURRENT_DATE(), TRUE, now(), now(), 2, 1);
INSERT INTO comment_favorite (id, favorite_date, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (3, CURRENT_DATE(), FALSE, now(), now(), 3, 1);
INSERT INTO comment_favorite (id, favorite_date, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (4, CURRENT_DATE(), FALSE, now(), now(), 1, 2);
INSERT INTO comment_favorite (id, favorite_date, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (5, CURRENT_DATE(), FALSE, now(), now(), 4, 2);
INSERT INTO comment_favorite (id, favorite_date, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (6, CURRENT_DATE(), FALSE, now(), now(), 5, 3);
INSERT INTO comment_favorite (id, favorite_date, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (7, CURRENT_DATE(), FALSE, now(), now(), 6, 4);
INSERT INTO comment_favorite (id, favorite_date, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (8, CURRENT_DATE(), FALSE, now(), now(), 7, 4);
INSERT INTO comment_favorite (id, favorite_date, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (9, CURRENT_DATE(), FALSE, now(), now(), 8, 5);

-- BOOK_COMMENT_REPLYデータ
INSERT INTO book_comment_reply (id, comment_text, comment_date, tweet_flag, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (1, 'たしかに', CURRENT_DATE(), FALSE, FALSE, now(), now(), 1, 2);
INSERT INTO book_comment_reply (id, comment_text, comment_date, tweet_flag, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (2, '断...', CURRENT_DATE(), FALSE, FALSE, now(), now(), 2, 1);
INSERT INTO book_comment_reply (id, comment_text, comment_date, tweet_flag, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (3, 'なんともいえない', '2019-03-01', TRUE, FALSE, now(), now(), 3, 4);
INSERT INTO book_comment_reply (id, comment_text, comment_date, tweet_flag, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (4, 'いい', '2019-04-02', TRUE, FALSE, now(), now(), 3, 5);
INSERT INTO book_comment_reply (id, comment_text, comment_date, tweet_flag, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (5, 'だめ。', CURRENT_DATE(), FALSE, FALSE, now(), now(), 4, 6);
INSERT INTO book_comment_reply (id, comment_text, comment_date, tweet_flag, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (6, 'せやな', CURRENT_DATE(), FALSE, FALSE, now(), now(), 6, 7);
INSERT INTO book_comment_reply (id, comment_text, comment_date, tweet_flag, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (7, 'そん', CURRENT_DATE(), FALSE, FALSE, now(), now(), 7, 8);
INSERT INTO book_comment_reply (id, comment_text, comment_date, tweet_flag, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (8, '良い本〜', CURRENT_DATE(), FALSE, FALSE, now(), now(), 8, 9);
INSERT INTO book_comment_reply (id, comment_text, comment_date, tweet_flag, delete_flag, created_at, updated_at, comment_id, user_id)
  VALUES (9, 'で。', CURRENT_DATE(), FALSE, FALSE, now(), now(), 9, 5);

-- BOOK_COMMENT_REPLY_FAVORITEデータ
INSERT INTO book_comment_reply_favorite (id, favorite_date, delete_flag, created_at, updated_at, reply_id, user_id)
  VALUES (1, CURRENT_DATE(), FALSE, now(), now(), 1, 1);
INSERT INTO book_comment_reply_favorite (id, favorite_date, delete_flag, created_at, updated_at, reply_id, user_id)
  VALUES (2, CURRENT_DATE(), TRUE, now(), now(), 2, 1);
INSERT INTO book_comment_reply_favorite (id, favorite_date, delete_flag, created_at, updated_at, reply_id, user_id)
  VALUES (3, CURRENT_DATE(), FALSE, now(), now(), 3, 1);
INSERT INTO book_comment_reply_favorite (id, favorite_date, delete_flag, created_at, updated_at, reply_id, user_id)
  VALUES (4, CURRENT_DATE(), FALSE, now(), now(), 1, 2);
INSERT INTO book_comment_reply_favorite (id, favorite_date, delete_flag, created_at, updated_at, reply_id, user_id)
  VALUES (5, CURRENT_DATE(), FALSE, now(), now(), 4, 2);
INSERT INTO book_comment_reply_favorite (id, favorite_date, delete_flag, created_at, updated_at, reply_id, user_id)
  VALUES (6, CURRENT_DATE(), FALSE, now(), now(), 5, 3);
INSERT INTO book_comment_reply_favorite (id, favorite_date, delete_flag, created_at, updated_at, reply_id, user_id)
  VALUES (7, CURRENT_DATE(), FALSE, now(), now(), 6, 4);
INSERT INTO book_comment_reply_favorite (id, favorite_date, delete_flag, created_at, updated_at, reply_id, user_id)
  VALUES (8, CURRENT_DATE(), FALSE, now(), now(), 7, 4);
INSERT INTO book_comment_reply_favorite (id, favorite_date, delete_flag, created_at, updated_at, reply_id, user_id)
  VALUES (9, CURRENT_DATE(), FALSE, now(), now(), 8, 5);

-- INTERESTED_BOOKデータ
INSERT INTO interested_book (id, interested_date, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (1, CURRENT_DATE(), FALSE, now(), now(), 5, 1);
INSERT INTO interested_book (id, interested_date, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (2, CURRENT_DATE(), FALSE, now(), now(), 6, 2);
INSERT INTO interested_book (id, interested_date, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (3, '2019-03-01', FALSE, now(), now(), 7, 2);
INSERT INTO interested_book (id, interested_date, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (4, '2019-04-02', TRUE, now(), now(), 8, 2);
INSERT INTO interested_book (id, interested_date, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (5, CURRENT_DATE(), FALSE, now(), now(), 5, 3);
INSERT INTO interested_book (id, interested_date, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (6, CURRENT_DATE(), FALSE, now(), now(), 4, 4);
INSERT INTO interested_book (id, interested_date, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (7, CURRENT_DATE(), FALSE, now(), now(), 5, 4);
INSERT INTO interested_book (id, interested_date, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (8, CURRENT_DATE(), FALSE, now(), now(), 8, 8);
INSERT INTO interested_book (id, interested_date, delete_flag, created_at, updated_at, book_id, user_id)
  VALUES (9, CURRENT_DATE(), FALSE, now(), now(), 9, 9);
