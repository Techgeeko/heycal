import withMDX from '@next/mdx';

const withMDXConfig = withMDX({
  extension: /\.mdx?$/,
});

const nextConfig = {
  images: {
    domains: ['i.pravatar.cc'],
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
};

export default withMDXConfig(nextConfig);