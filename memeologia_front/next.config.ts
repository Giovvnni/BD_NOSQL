module.exports = {
  async redirects() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://memeologia.duckdns.org:8000/api/:path*', // Cambia el puerto si es necesario
        permanent: false,
      },
    ]
  }
}