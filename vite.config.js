
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  base: '/Real_Time_Chat_Application_fronend/',

  server: {
    proxy: {
      '/api': {
        target: 'http://realtime-chat-alb-1589425641.ap-south-1.elb.amazonaws.com',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin')
          })
        }
      },

      '/chat': {
        target: 'http://realtime-chat-alb-1589425641.ap-south-1.elb.amazonaws.com',
        changeOrigin: true,
        ws: true
      }
    }
  }
})
