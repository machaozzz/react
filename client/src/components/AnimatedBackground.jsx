import React from 'react'
import { motion } from 'framer-motion'

export default function AnimatedBackground(){
  return (
    <div className="animated-bg" aria-hidden>
      <motion.div className="shape s1" animate={{ x: [0, -40, 0], y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="shape s2" animate={{ x: [0, 30, 0], y: [0, 10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="shape s3" animate={{ scale: [1,1.06,1], rotate: [0,6,0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
    </div>
  )
}
