const LogoutPage = {
  async render() {
    // Menghapus token dari localStorage
    localStorage.removeItem('token');
    
    // Redirect ke halaman login setelah logout
    setTimeout(() => {
      window.location.href = '#/login'; // Halaman login
    }, 2000); // Redirect setelah 2 detik
    return `
      <section class="container">
        <h2>Logout</h2>
        <p>Anda telah berhasil logout. Terima kasih telah menggunakan aplikasi kami.</p>
        <a href="#/login" class="button">Kembali ke Halaman Login</a>
      </section>
    `;
  },
  async afterRender() {}
};

export default LogoutPage;
