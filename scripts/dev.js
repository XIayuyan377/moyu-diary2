#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')

console.log('🚀 启动开发环境...\n')

// 启动 Vite
const vite = spawn('npx', ['vite', '--host'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
})

// 等待 3 秒后启动 Electron
setTimeout(() => {
  console.log('\n📱 启动 Electron...\n')
  
  const electron = spawn('electron', ['.'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: true
  })

  electron.on('exit', (code) => {
    console.log(`\nElectron 已关闭 (code: ${code})`)
    process.exit(code)
  })
}, 4000)

vite.on('error', (err) => {
  console.error('Vite 启动失败:', err)
  process.exit(1)
})
