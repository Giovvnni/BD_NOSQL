module.exports = {
  async redirects() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://200.104.72.42/:8000/api/:path*', // Cambia el puerto si es necesario
        permanent: false,
      },
    ]
  }
}