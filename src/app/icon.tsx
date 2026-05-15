import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1e293b',
          width: '100%',
          height: '100%',
          borderRadius: 96,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: 'white',
            width: 220,
            height: 260,
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 60,
            gap: 20,
            position: 'relative',
          }}
        >
          <div style={{ background: '#e2e8f0', width: 148, height: 14, borderRadius: 7 }} />
          <div style={{ background: '#e2e8f0', width: 116, height: 14, borderRadius: 7 }} />
          <div style={{ background: '#e2e8f0', width: 132, height: 14, borderRadius: 7 }} />
          <div style={{ background: '#e2e8f0', width: 100, height: 14, borderRadius: 7 }} />
          <div
            style={{
              position: 'absolute',
              top: -16,
              background: '#94a3b8',
              width: 92,
              height: 32,
              borderRadius: 10,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
