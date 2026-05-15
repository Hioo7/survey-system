import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1e293b',
          width: '100%',
          height: '100%',
          borderRadius: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: 'white',
            width: 74,
            height: 84,
            borderRadius: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 18,
            gap: 6,
            position: 'relative',
          }}
        >
          <div style={{ background: '#e2e8f0', width: 44, height: 5, borderRadius: 3 }} />
          <div style={{ background: '#e2e8f0', width: 34, height: 5, borderRadius: 3 }} />
          <div style={{ background: '#e2e8f0', width: 40, height: 5, borderRadius: 3 }} />
          <div style={{ background: '#e2e8f0', width: 28, height: 5, borderRadius: 3 }} />
          <div
            style={{
              position: 'absolute',
              top: -7,
              background: '#94a3b8',
              width: 30,
              height: 12,
              borderRadius: 4,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  )
}
