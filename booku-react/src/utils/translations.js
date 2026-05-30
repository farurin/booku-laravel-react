export const translations = {
  // Bahasa Indonesia
  id: {
    // validasi login/register
    val_email_empty: "*Email tidak boleh kosong.",
    val_email_invalid: "*Format email tidak valid.",
    val_pass_empty: "*Password tidak boleh kosong.",
    val_pass_regex:
      "*Password min. 8 karakter, wajib ada huruf besar, kecil, angka, & simbol.",

    // Navbar
    nav_home: "Beranda",
    nav_categories: "Kategori",
    nav_corner: "Pojok Baca",
    nav_panel: "Dashboard",
    nav_profile: "Profil",
    nav_signup: "Daftar",
    lang_button: "English",

    // About.jsx
    about_heading: "Tentang Kami",
    about_p1:
      "Funtasya Storyland adalah sub-brand dari Funtasya World, hadir khusus untuk menghadirkan cerita-cerita anak berkualitas dalam format digital. Kami percaya setiap anak di mana pun mereka berada, berhak tumbuh bersama cerita yang menyenangkan, bermakna, dan penuh imajinasi.",
    about_p2:
      "Tersedia di Android, iOS (soon), dan versi web, Funtasya Storyland memastikan cerita favorit si kecil selalu bisa diakses kapan saja dan di mana saja, cukup dari genggaman tangan.",
    about_p3:
      "Di Funtasya World, kami selalu percaya bahwa dunia anak adalah dunia yang penuh kemungkinan. Dari situlah Funtasya Storyland lahir—sebuah ruang digital yang aman, menyenangkan, dan penuh cerita untuk menemani tumbuh kembang anak.",
    about_p4:
      "Membaca bukan sekadar keterampilan. Membaca adalah pintu menuju empati, imajinasi, dan rasa ingin tahu yang tak terbatas. Tapi kenyataannya, akses terhadap bacaan berkualitas masih jadi tantangan bagi banyak keluarga.",
    about_fact1:
      "1 dari 3 anak di dunia tidak memiliki akses ke bahan bacaan yang sesuai usianya (UNESCO, 2023)",
    about_fact2:
      "Lebih dari 617 juta anak belum mencapai kemampuan membaca minimum (Bank Dunia, 2023)",
    about_fact3:
      "Sekitar 50% anak di negara berkembang tidak memiliki satu pun buku di rumah (GPE, 2022)",
    about_closing:
      "Funtasya Storyland hadir sebagai jawaban membawa cerita langsung ke tangan anak-anak, tanpa batas.",

    // BookDetail.jsx
    bd_loading: "Menyiapkan Cerita...",
    bd_not_found: "Buku tidak ditemukan!",
    bd_guest_fav_title: "Wah, Rak Favoritmu Masih Rahasia!",
    bd_guest_fav_desc:
      "Yuk, buat akunmu sekarang supaya semua cerita yang kamu beri tanda hati tetap tersimpan aman untuk dibaca lagi nanti.",
    bd_btn_register: "Buat Akun",
    bd_btn_later: "Nanti Saja",
    bd_rm_fav_title: "Hapus dari Favorit",
    bd_rm_fav_desc:
      "Setelah dihapus, cerita ini tidak akan ada di daftar favoritmu",
    bd_btn_delete: "Hapus",
    bd_btn_cancel: "Batalkan",
    bd_add_fav_title: "Difavoritkan",
    bd_add_fav_desc: "Lihat dan baca cerita yang sudah kamu favoritkan yuk!",
    bd_btn_view: "Lihat",
    bd_btn_close: "Tutup",
    bd_guest_save_title: "Rak Bukumu Masih Menunggu!",
    bd_guest_save_desc:
      "Yuk, buat akunmu sekarang supaya semua cerita yang kamu simpan punya tempat yang rapi di rak pribadimu.",
    bd_add_save_title: "Berhasil Menyimpan",
    bd_add_save_desc:
      "Kamu bisa melihat cerita yang sudah kamu simpan di halaman Corner",
    bd_others: "lainnya",

    // Categories.jsx & CategoryDetail.jsx
    cat_err_title: "Gagal Memuat Kategori",
    cat_err_col: "Koleksi Tidak Ditemukan",
    btn_retry: "Coba Lagi",
    cat_loading: "Memuat Daftar Kategori...",
    cd_loading: "Menyiapkan Koleksi Buku...",
    cat_title: "Kategori",
    cat_desc:
      "Temukan berbagai macam cerita menarik berdasarkan kategori pilihan.",
    cat_count: "cerita",
    cd_fallback_desc: "Jelajahi kisah dari berbagai kategori.",
    cd_search: "Cari judul buku...",
    cd_empty: "Tidak ada buku yang sesuai dengan pencarian di kategori ini.",

    // Corner.jsx
    cor_today: "Hari Ini",
    cor_yesterday: "Kemarin",
    cor_older: "Lebih Lama",
    cor_fav: "Favorit",
    cor_saved: "Disimpan",
    cor_err: "Oops! Terjadi Kesalahan",
    cor_loading: "Memuat data",
    cor_empty_search: "Pencarian tidak ditemukan",
    cor_empty_search_desc_1: "Tidak ada buku yang sesuai dengan kata kunci",
    cor_empty_search_desc_2: "di rak ini.",
    cor_fav_title: "Semua cerita favorit-mu",
    cor_fav_desc:
      "Kamu dapat menekan tombol di sampul cerita untuk mengubah cerita favoritmu",
    cor_save_title: "Disimpan untuk nanti",
    cor_save_desc: "cerita menunggumu untuk dibaca.",
    cor_result: "Hasil Pencarian",
    cor_empty_hist_title: "Riwayat Bacamu Masih Kosong",
    cor_empty_hist_desc: "Daftar buku yang kamu baca akan muncul di sini.",
    cor_guest_hist_title: "Riwayat Bacamu Masih Rahasia!",
    cor_guest_hist_desc:
      "Yuk, buat akunmu sekarang untuk menyimpan riwayat bacaanmu.",
    cor_empty_fav_title: "Belum Ada Cerita yang Kamu Sukai",
    cor_empty_fav_desc:
      "Kamu dapat menekan tombol di sampul cerita untuk mengubah cerita favoritmu",
    cor_guest_fav_title: "Wah, Rak Favoritmu Masih Kosong!",
    cor_guest_fav_desc: "Yuk, buat akunmu sekarang.",
    cor_empty_save_title: "Belum Ada Cerita yang Kamu Simpan",
    cor_empty_save_desc:
      "Klik tanda bookmark pada cerita yang ingin kamu simpan.",
    cor_guest_save_title: "Rak Bukumu Masih Menunggu!",
    cor_guest_save_desc: "Yuk, buat akunmu sekarang.",

    // Home.jsx
    home_err_title: "Oops! Gagal Memuat BookU",
    home_btn_reload: "Muat Ulang Halaman",
    home_loading: "Memuat Booku...",

    // Login.jsx & Register.jsx
    auth_login_title: "Selamat Datang !",
    auth_login_desc: "Lengkapi Email dan Password Untuk Masuk",
    auth_email_label: "Email",
    auth_email_ph: "Masukkan email",
    auth_pass_label: "Password",
    auth_pass_ph: "Masukkan Password",
    auth_login_err_val: "*Harap lengkapi email dan password dengan benar.",
    auth_login_err_cred: "*Email atau kata sandi yang Anda masukkan salah.",
    auth_btn_login: "Masuk",
    auth_or_login: "atau masuk dengan",
    auth_no_account: "Tidak mempunyai akun?",
    auth_link_register: "DAFTAR",
    auth_popup_dev_title: "Fitur Segera Hadir!",
    auth_popup_dev_desc:
      "Maaf, fitur ini saat ini masih dalam tahap pengembangan.",
    auth_btn_ok: "Oke, Mengerti",
    auth_btn_close: "Tutup",
    auth_reg_title: "Buat Akun Baru !",
    auth_reg_desc: "Lengkapi form di bawah untuk mendaftar",
    auth_btn_reg: "Daftar",
    auth_or_reg: "atau daftar dengan",
    auth_has_account: "Sudah mempunyai akun?",
    auth_link_login: "MASUK",

    // Profile.jsx
    prof_title: "Profile",
    prof_tab_status: "Status",
    prof_tab_achievement: "Pencapaian",
    prof_tab_leaderboard: "Papan Ranking",
    prof_tab_mission: "Misi",
    prof_btn_logout: "Logout",
    prof_logout_confirm: "Apakah kamu yakin ingin keluar?",
    prof_logout_desc: "Kamu bisa masuk lagi kapan saja",
    prof_btn_exit: "Keluar",

    // BannerCorner.jsx
    bc_title: "Pojok Baca",
    bc_desc:
      "Ayo lihat riwayat bacaanmu, buku favorit dan yang sudah kamu simpan disini",

    // BookInfoBanner.jsx
    bib_reading: "Sedang Membaca..",
    bib_pages: "Halaman",
    bib_category: "Kategori",
    bib_synopsis: "Sinopsis",
    bib_no_synopsis: "Sinopsis belum tersedia untuk cerita ini.",

    // BookListSection.jsx
    bl_announcement_title: "Pengumuman",
    bl_announcement_desc:
      "Banyak kisah menarik menunggu untuk kamu jelajahi. Temukan cerita favoritmu sekarang.",
    bl_btn_check: "cek sekarang",
    bl_new_book_title: "BUKU BARU!",
    bl_new_book_desc_1: "Ada buku baru untukmu:",
    bl_new_book_desc_2: "Buku ini sudah siap kamu baca. Selamat menikmati!",
    bl_btn_view: "Lihat",
    bl_btn_close: "Tutup",
    bl_see_all: "Lihat Semua",
    bl_empty_category: "Belum ada buku di kategori ini.",

    // BookPreviewModal.jsx
    bpm_fav_guest_title: "Suka Cerita Ini?",
    bpm_fav_guest_desc:
      "Yuk, buat akunmu sekarang supaya semua cerita yang kamu beri tanda hati ini tersimpan rapi",
    bpm_btn_register: "Buat Akun",
    bpm_btn_later: "Nanti Saja",
    bpm_rm_fav_title: "Hapus dari Favorit",
    bpm_rm_fav_desc:
      "Setelah dihapus, cerita ini tidak akan ada di daftar favoritmu",
    bpm_btn_remove: "Hapus",
    bpm_btn_cancel: "Batalkan",
    bpm_add_fav_title: "Difavoritkan",
    bpm_add_fav_desc: "Lihat dan baca cerita yang sudah kamu favoritkan yuk!",
    bpm_btn_view: "Lihat",
    bpm_btn_close: "Tutup",
    bpm_save_guest_title: "Rak Bukumu Masih Menunggu!",
    bpm_save_guest_desc:
      "Yuk, buat akunmu sekarang supaya semua cerita yang kamu simpan punya tempat yang rapi di rak pribadimu.",
    bpm_add_save_title: "Berhasil Menyimpan",
    bpm_add_save_desc:
      "Kamu bisa melihat cerita yang sudah kamu simpan di halaman Corner",
    bpm_pages: "Halaman",
    bpm_default_category: "Cerita Nusantara",
    bpm_synopsis: "Sinopsis",
    bpm_no_synopsis: "Sinopsis cerita belum tersedia.",
    bpm_btn_read: "Baca",
    bpm_btn_watch: "Tonton",

    // Carousel.jsx
    car_tab_recom: "Rekomendasi",
    car_tab_popular: "Populer",
    car_tab_new: "Terbaru",
    car_search_res: "Hasil Pencarian:",
    car_search_ph: "Cari judul cerita...",
    car_empty_search: "Pencarian tidak ditemukan.",
    car_empty_cat: "Tidak ada buku di kategori ini.",

    // CategorySlider.jsx
    cat_slider_title: "Kategori Cerita",

    // CtaDownload.jsx
    cta_title: "Dunia Cerita Seru Menunggumu!",
    cta_desc:
      "Jelajahi petualangan, dongeng, dan kisah seru lainnya langsung dari aplikasi Funtasya StoryLand.",
    cta_soon: "Segera",

    // FilterCorner.jsx
    fc_history: "Riwayat",
    fc_favorite: "Favorit",
    fc_saved: "Disimpan",
    fc_search: "Cari judul buku...",

    // Footer.jsx
    foot_about: "Tentang Kami",
    foot_category_title: "Kategori Cerita",
    foot_category: "Kategori Cerita",
    foot_corner: "Pojok Baca",
    foot_donate: "Donasi",

    // HeroSection.jsx
    hero_btn: "Baca Cerita Sekarang",
    hero_or: "atau",

    // ProfileAchievement.jsx
    pa_loading: "Memuat Rekor Pribadi...",
    pa_title_record: "Rekor Pribadi",
    pa_join_date: "Bergabung Sejak",
    pa_total_points: "Total Poin",
    pa_xp_collected: "XP Terkumpul",
    pa_current_streak: "Streaks Saat Ini",
    pa_active_days: "Hari Aktif",
    pa_title_awards: "Penghargaan",

    // ProfileCharacterSelect.jsx
    pcs_title: "Pilih Karakter",
    pcs_filter_all: "Semua",
    pcs_filter_unlocked: "Unlocked",
    pcs_filter_locked: "Locked",
    pcs_status_locked: "Locked",

    // ProfileInfoCard.jsx
    pic_btn_edit: "Ubah",
    pic_age_not_set: "Umur belum diatur",
    pic_age_years: "Tahun",
    pic_daily_streak: "Streak Harian",
    pic_achievements: "Pencapaian",
    pic_rank: "Peringkat",
    pic_modal_title: "Ubah Profile",
    pic_label_name: "Nama*",
    pic_ph_name: "Masukkan nama",
    pic_label_age: "Usia*",
    pic_ph_age: "Masukkan usia",
    pic_select_char: "Pilih karakter profile",
    pic_no_avatar: "Belum ada pilihan avatar.",
    pic_btn_saving: "Menyimpan...",
    pic_btn_save: "Simpan",
    pic_loading_status: "Memuat Data Status...",

    // ProfileLeaderboard.jsx
    pl_loading: "Memuat Papan Peringkat...",
    pl_title: "Papan Peringkat",
    pl_desc: "Peringkat diperbarui secara berkala setiap Senin pukul 00:00 WIB",
    pl_last_updated: "Terakhir diperbarui",
    pl_col_rank: "Ranking",
    pl_col_name: "Nama",
    pl_col_streak: "Streak Harian",
    pl_col_pages: "Total Halaman",
    pl_col_awards: "Total Penghargaan",
    pl_empty_data: "Belum ada data peringkat lainnya.",

    // ProfileMission.jsx
    pm_loading: "Memuat Misi...",
    pm_btn_done: "Selesai",
    pm_btn_claim: "Ambil",
    pm_btn_start: "Mulai",
    pm_empty_mission: "Belum ada misi yang tersedia saat ini.",

    // ProfileStatus.jsx
    ps_loading_char: "Memuat Karakter...",
    ps_btn_coming_soon: "Segera Hadir",
    ps_btn_save: "Simpan",
    ps_btn_edit: "Ubah",

    // Progress.jsx (pakai FilterCorner)

    // ProgressCard.jsx
    pc_rm_fav_title: "Hapus dari Favorit",
    pc_rm_fav_desc:
      "Setelah dihapus, cerita ini tidak akan ada di daftar favoritmu",
    pc_btn_remove: "Hapus",
    pc_btn_cancel: "Batalkan",

    // SavedCard.jsx
    sc_just_now: "Baru saja",
    sc_mins_ago: "menit lalu",
    sc_hours_ago: "jam lalu",
    sc_yesterday: "Kemarin",
    sc_days_ago: "hari lalu",
    sc_months_ago: "bulan lalu",
    sc_years_ago: "tahun lalu",
    sc_category: "Kategori",
    sc_read: "Dibaca",
    sc_times: "kali",
    sc_saved: "Disimpan",
    sc_btn_read: "Baca",

    // StoryAction.jsx
    sa_favorite: "Favorit",
    sa_fullscreen: "Layar Penuh",
    sa_save: "Simpan",

    // StoryReader.jsx
    sr_empty_title: "Halaman Belum Tersedia",
    sr_empty_desc: "Cerita ini sedang dalam tahap ilustrasi.",
    sr_btn_back: "Kembali",
    sr_no_translation: "Terjemahan belum tersedia.",
    sr_show_text: "Munculkan Teks",
    sr_btn_start: "Mulai Membaca!",
    sr_btn_resume: "Lanjut Baca",
    sr_btn_restart: "Mulai dari Awal",
  },

  // Bahasa Inggris
  en: {
    // validasi login/register
    val_email_empty: "*Email cannot be empty.",
    val_email_invalid: "*Invalid email format.",
    val_pass_empty: "*Password cannot be empty.",
    val_pass_regex:
      "*Password min. 8 chars, requires uppercase, lowercase, number & symbol.",

    // Navbar
    nav_home: "Home",
    nav_categories: "Categories",
    nav_corner: "Corner",
    nav_panel: "Dashboard",
    nav_profile: "Profile",
    nav_signup: "Sign up",
    lang_button: "Indonesia",

    // About.jsx
    about_heading: "About Us",
    about_p1:
      "Funtasya Storyland is a sub-brand of Funtasya World, created specifically to deliver high-quality children's stories in a digital format. We believe every child, wherever they are, deserves to grow up with stories that are fun, meaningful, and full of imagination.",
    about_p2:
      "Available on Android, iOS (soon), and web, Funtasya Storyland ensures your little one's favorite stories can always be accessed anytime and anywhere, right from the palm of your hand.",
    about_p3:
      "At Funtasya World, we always believe that a child's world is full of possibilities. That is where Funtasya Storyland was born—a safe, fun, and story-filled digital space to accompany children's growth and development.",
    about_p4:
      "Reading is not just a skill. Reading is a door to empathy, imagination, and limitless curiosity. But the reality is, access to quality reading materials is still a challenge for many families.",
    about_fact1:
      "1 in 3 children worldwide do not have access to age-appropriate reading materials (UNESCO, 2023)",
    about_fact2:
      "More than 617 million children have not reached minimum reading proficiency (World Bank, 2023)",
    about_fact3:
      "Around 50% of children in developing countries do not have a single book at home (GPE, 2022)",
    about_closing:
      "Funtasya Storyland is here as the answer bringing stories directly to children's hands, without limits.",

    // BookDetail.jsx
    bd_loading: "Preparing Story...",
    bd_not_found: "Book not found!",
    bd_guest_fav_title: "Whoops, Your Favorite Shelf is a Secret!",
    bd_guest_fav_desc:
      "Create an account now so all the stories you loved remain safely stored for you to read later.",
    bd_btn_register: "Create Account",
    bd_btn_later: "Maybe Later",
    bd_rm_fav_title: "Remove from Favorites",
    bd_rm_fav_desc:
      "Once removed, this story will no longer be in your favorite list.",
    bd_btn_delete: "Remove",
    bd_btn_cancel: "Cancel",
    bd_add_fav_title: "Added to Favorites",
    bd_add_fav_desc: "Let's view and read the stories you've favorited!",
    bd_btn_view: "View",
    bd_btn_close: "Close",
    bd_guest_save_title: "Your Bookshelf is Waiting!",
    bd_guest_save_desc:
      "Create an account now so all the stories you save have a neat place on your personal shelf.",
    bd_add_save_title: "Successfully Saved",
    bd_add_save_desc: "You can view your saved stories on the Corner page.",
    bd_others: "more",

    // Categories.jsx & CategoryDetail.jsx
    cat_err_title: "Failed to Load Categories",
    cat_err_col: "Collection Not Found",
    btn_retry: "Try Again",
    cat_loading: "Loading Category List...",
    cd_loading: "Preparing Book Collection...",
    cat_title: "Categories",
    cat_desc: "Find various interesting stories based on selected categories.",
    cat_count: "stories",
    cd_fallback_desc: "Explore tales from various categories.",
    cd_search: "Search book titles...",
    cd_empty: "No books found matching the search in this category.",

    // Corner.jsx
    cor_today: "Today",
    cor_yesterday: "Yesterday",
    cor_older: "Older",
    cor_fav: "Favorites",
    cor_saved: "Saved",
    cor_err: "Oops! An Error Occurred",
    cor_loading: "Loading data",
    cor_empty_search: "Search not found",
    cor_empty_search_desc_1: "No books found matching the keyword",
    cor_empty_search_desc_2: "in this shelf.",
    cor_fav_title: "All your favorite stories",
    cor_fav_desc:
      "You can tap the button on the story cover to change your favorite stories.",
    cor_save_title: "Saved for later",
    cor_save_desc: "stories waiting for you to read.",
    cor_result: "Search Results",
    cor_empty_hist_title: "Your Reading History is Empty",
    cor_empty_hist_desc: "The list of books you read will appear here.",
    cor_guest_hist_title: "Your Reading History is a Secret!",
    cor_guest_hist_desc:
      "Let's create your account now to save your reading history.",
    cor_empty_fav_title: "No Stories Liked Yet",
    cor_empty_fav_desc:
      "You can tap the button on the story cover to change your favorite stories.",
    cor_guest_fav_title: "Whoops, Your Favorite Shelf is Empty!",
    cor_guest_fav_desc: "Let's create your account now.",
    cor_empty_save_title: "No Stories Saved Yet",
    cor_empty_save_desc:
      "Click the bookmark icon on the stories you want to save.",
    cor_guest_save_title: "Your Bookshelf is Waiting!",
    cor_guest_save_desc: "Let's create your account now.",

    // Home.jsx
    home_err_title: "Oops! Failed to Load BookU",
    home_btn_reload: "Reload Page",
    home_loading: "Loading BookU...",

    // Login.jsx & Register.jsx
    auth_login_title: "Welcome Back!",
    auth_login_desc: "Enter your Email and Password to Login",
    auth_email_label: "Email",
    auth_email_ph: "Enter your email",
    auth_pass_label: "Password",
    auth_pass_ph: "Enter your Password",
    auth_login_err_val: "*Please enter a valid email and password.",
    auth_login_err_cred: "*The email or password you entered is incorrect.",
    auth_btn_login: "Login",
    auth_or_login: "or login with",
    auth_no_account: "Don't have an account?",
    auth_link_register: "REGISTER",
    auth_popup_dev_title: "Feature Coming Soon!",
    auth_popup_dev_desc: "Sorry, this feature is currently under development.",
    auth_btn_ok: "Okay, Got it",
    auth_btn_close: "Close",
    auth_reg_title: "Create New Account!",
    auth_reg_desc: "Fill the form below to register",
    auth_btn_reg: "Register",
    auth_or_reg: "or register with",
    auth_has_account: "Already have an account?",
    auth_link_login: "LOGIN",

    // Profile.jsx
    prof_title: "Profile",
    prof_tab_status: "Status",
    prof_tab_achievement: "Achievements",
    prof_tab_leaderboard: "Leaderboard",
    prof_tab_mission: "Missions",
    prof_btn_logout: "Logout",
    prof_logout_confirm: "Are you sure you want to log out?",
    prof_logout_desc: "You can log back in anytime",
    prof_btn_exit: "Log out",

    // BannerCorner.jsx
    bc_title: "Corner",
    bc_desc:
      "Let's check your reading history, favorite books, and saved stories here",

    // BookInfoBanner.jsx
    bib_reading: "Currently Reading..",
    bib_pages: "Pages",
    bib_category: "Category",
    bib_synopsis: "Synopsis",
    bib_no_synopsis: "Synopsis is not available for this story yet.",

    // BookListSection.jsx
    bl_announcement_title: "Announcement",
    bl_announcement_desc:
      "Many exciting stories await you to explore. Find your favorite story now.",
    bl_btn_check: "check now",
    bl_new_book_title: "NEW BOOK!",
    bl_new_book_desc_1: "There's a new book for you:",
    bl_new_book_desc_2: "This book is ready for you to read. Enjoy!",
    bl_btn_view: "View",
    bl_btn_close: "Close",
    bl_see_all: "See All",
    bl_empty_category: "No books in this category yet.",

    // BookPreviewModal.jsx
    bpm_fav_guest_title: "Like This Story?",
    bpm_fav_guest_desc:
      "Create your account now so all the stories you loved are kept safe.",
    bpm_btn_register: "Create Account",
    bpm_btn_later: "Maybe Later",
    bpm_rm_fav_title: "Remove from Favorites",
    bpm_rm_fav_desc:
      "Once removed, this story will no longer be in your favorite list.",
    bpm_btn_remove: "Remove",
    bpm_btn_cancel: "Cancel",
    bpm_add_fav_title: "Added to Favorites",
    bpm_add_fav_desc: "Let's view and read the stories you've favorited!",
    bpm_btn_view: "View",
    bpm_btn_close: "Close",
    bpm_save_guest_title: "Your Bookshelf is Waiting!",
    bpm_save_guest_desc:
      "Create an account now so all the stories you save have a neat place on your personal shelf.",
    bpm_add_save_title: "Successfully Saved",
    bpm_add_save_desc: "You can view your saved stories on the Corner page",
    bpm_pages: "Pages",
    bpm_default_category: "Archipelago Story",
    bpm_synopsis: "Synopsis",
    bpm_no_synopsis: "Story synopsis is not available yet.",
    bpm_btn_read: "Read",
    bpm_btn_watch: "Watch",

    // Carousel.jsx
    car_tab_recom: "Recommendations",
    car_tab_popular: "Popular",
    car_tab_new: "Latest",
    car_search_res: "Search Results:",
    car_search_ph: "Search story titles...",
    car_empty_search: "No search results found.",
    car_empty_cat: "No books in this category.",

    // CategorySlider.jsx
    cat_slider_title: "Story Categories",

    // CtaDownload.jsx
    cta_title: "An Exciting World of Stories Awaits You!",
    cta_desc:
      "Explore adventures, fairy tales, and other exciting stories directly from the Funtasya StoryLand app.",
    cta_soon: "Soon",

    // FilterCorner.jsx
    fc_history: "History",
    fc_favorite: "Favorite",
    fc_saved: "Saved",
    fc_search: "Search book title...",

    // Footer.jsx
    foot_about: "About Us",
    foot_category_title: "Story Categories",
    foot_category: "Story Categories",
    foot_corner: "Corner",
    foot_donate: "Donate",

    // HeroSection.jsx
    hero_btn: "Start Reading Stories",
    hero_or: "or",

    // ProfileAchievement.jsx
    pa_loading: "Loading Personal Records...",
    pa_title_record: "Personal Records",
    pa_join_date: "Joined Since",
    pa_total_points: "Total Points",
    pa_xp_collected: "XP Collected",
    pa_current_streak: "Current Streaks",
    pa_active_days: "Active Days",
    pa_title_awards: "Awards",

    // ProfileCharacterSelect.jsx
    pcs_title: "Select Character",
    pcs_filter_all: "All",
    pcs_filter_unlocked: "Unlocked",
    pcs_filter_locked: "Locked",
    pcs_status_locked: "Locked",

    // ProfileInfoCard.jsx
    pic_btn_edit: "Edit",
    pic_age_not_set: "Age not set",
    pic_age_years: "Years old",
    pic_daily_streak: "Daily Streak",
    pic_achievements: "Achievements",
    pic_rank: "Rank",
    pic_modal_title: "Edit Profile",
    pic_label_name: "Name*",
    pic_ph_name: "Enter name",
    pic_label_age: "Age*",
    pic_ph_age: "Enter age",
    pic_select_char: "Select profile character",
    pic_no_avatar: "No avatar choices yet.",
    pic_btn_saving: "Saving...",
    pic_btn_save: "Save",
    pic_loading_status: "Loading Status Data...",

    // ProfileLeaderboard.jsx
    pl_loading: "Loading Leaderboard...",
    pl_title: "Leaderboard",
    pl_desc: "Rankings are updated periodically every Monday at 00:00 WIB",
    pl_last_updated: "Last updated",
    pl_col_rank: "Rank",
    pl_col_name: "Name",
    pl_col_streak: "Daily Streak",
    pl_col_pages: "Total Pages",
    pl_col_awards: "Total Awards",
    pl_empty_data: "No other ranking data available yet.",

    // ProfileMission.jsx
    pm_loading: "Loading Missions...",
    pm_btn_done: "Done",
    pm_btn_claim: "Claim",
    pm_btn_start: "Start",
    pm_empty_mission: "No missions available at the moment.",

    // ProfileStatus.jsx
    ps_loading_char: "Loading Characters...",
    ps_btn_coming_soon: "Coming Soon",
    ps_btn_save: "Save",
    ps_btn_edit: "Edit",

    // Progress.jsx (pakai FilterCorner)

    // ProgressCard.jsx
    pc_rm_fav_title: "Remove from Favorites",
    pc_rm_fav_desc:
      "Once removed, this story will no longer be in your favorite list",
    pc_btn_remove: "Remove",
    pc_btn_cancel: "Cancel",

    // SavedCard.jsx
    sc_just_now: "Just now",
    sc_mins_ago: "minutes ago",
    sc_hours_ago: "hours ago",
    sc_yesterday: "Yesterday",
    sc_days_ago: "days ago",
    sc_months_ago: "months ago",
    sc_years_ago: "years ago",
    sc_category: "Category",
    sc_read: "Read",
    sc_times: "times",
    sc_saved: "Saved",
    sc_btn_read: "Read",

    // StoryAction.jsx
    sa_favorite: "Favorite",
    sa_fullscreen: "Fullscreen",
    sa_save: "Save",

    // StoryReader.jsx
    sr_empty_title: "Page Not Available",
    sr_empty_desc: "This story is currently in the illustration phase.",
    sr_btn_back: "Back",
    sr_no_translation: "Translation not available yet.",
    sr_show_text: "Show Text",
    sr_btn_start: "Start Reading!",
    sr_btn_resume: "Resume Reading",
    sr_btn_restart: "Start from Beginning",
  },
};
