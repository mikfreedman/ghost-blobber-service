# Ghost Blobber Service

This project is a storage adapter for [TryGhost/Ghost](https://github.com/TryGhost/Ghost) `~v.11`

It connects with a contrived (i.e. pretty basic, not production ready) blob store service called [mikfreedman/blobber](https://github.com/mikfreedman/blobber)

## Usage
In your config.js include the following configuration

```javascript
  storage: {
    active: 'ghost-blobber-service',
    'ghost-blobber-service': {
      url: process.env.BLOBBER_API_URL,
      apiKey: process.env.BLOBBER_API_KEY
    }
  }
```

It should "Just Work"
