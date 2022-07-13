import BoughIcon from '@mui/icons-material';

const imageCount = 20;
const images = require.context('../../assets/img/nfts', true);
const nftImages = [];

for( let i = 1; i <= imageCount ; i ++ ) {
    const image = images(`./${i}.png`).default;
    nftImages.push(image);
}

export const gains = [
    {
        date: 'Apr 13, 2022', 
        collection: {
            image: nftImages[0],
            title: 'Cryptoadz'
        }, 
        item: {
            image: nftImages[1],
            title: 'Cryptoadz#468',
        },
        activity: { 
            icon: '', 
            title: 'Sold'
        }, 
        timeHeld: {
            time: '216days',
            tooltip: {
                acquired: '9/9/2021',
                sold: '4/13/2022',
            }
        },
        costBasis: {
            price: 1.09,
            tooltip: {
                acquire: 1.08,
                gas: .01,
                total: 1.09
            }
        }, 
        revenue: 12.13, 
        realizedGains: 11.04, 
        roi: '+1012.85%', 
    },
]

export const nfts = [
    {
        date: 'Apr 5, 2022', 
        collection: {
            image: nftImages[0],
            title: 'Starwolvez#23'
        }, 
        item: {
            image: nftImages[1],
            title: '',
        },
        activity: { 
            icon: '', 
            title: 'Mint'
        }, 
        sentFrom: '0x3242...0b1', 
        sentTo: '0xF0sa...0b1', 
        revenue: '-', 
        cost: '0.0888', 
        gas: 0.00441, 
        otherFees: '-'
    },
    {
        date: 'Feb 26, 2022', 
        collection: {
            image: nftImages[2], 
            title: 'Funcles'
        }, 
        item: {
            image: nftImages[3],
            title: 'Funcles#1528'
        },
        activity: { 
            icon: '', 
            title: 'Mint'
        }, 
        sentFrom: '0x3242...0b1', 
        sentTo: '0xF0sa...0b1', 
        revenue: '-', 
        cost: '0.0888', 
        gas: 0.00441, 
        otherFees: '-'
    },
    {
        date: 'Apr 5, 2022', 
        collection: {
            image: nftImages[4], 
            title: 'Starwolvez#23'
        }, 
        item: {
            image: nftImages[5],
            title: '',
        }, 
        activity: { 
            icon: '', 
            title: 'Mint'
        }, 
        sentFrom: '0x3242...0b1', 
        sentTo: '0xF0sa...0b1', 
        revenue: '-', 
        cost: '0.0888', 
        gas: 0.00441, 
        otherFees: '-'
    },
    {
        date: 'Apr 5, 2022', 
        collection: {
            image: nftImages[6], 
            title: 'Starwolvez#23'
        }, 
        item: {
            image: nftImages[7],
            title: '',
        }, 
        activity: { 
            icon: '', 
            title: 'Mint'
        }, 
        sentFrom: '0x3242...0b1', 
        sentTo: '0xF0sa...0b1', 
        revenue: '-', 
        cost: '0.0888', 
        gas: 0.00441, 
        otherFees: '-'
    },
    {
        date: 'Apr 5, 2022', 
        collection: {
            image: nftImages[8], 
            title: 'Starwolvez#23'
        }, 
        item: {
            image: nftImages[9],
            title: '',
        }, 
        activity: { 
            icon: '', 
            title: 'Mint'
        }, 
        sentFrom: '0x3242...0b1', 
        sentTo: '0xF0sa...0b1', 
        revenue: '-', 
        cost: '0.0888', 
        gas: 0.00441, 
        otherFees: '-'
    },
    {
        date: 'Apr 5, 2022', 
        collection: {
            image: nftImages[10], 
            title: 'Starwolvez#23'
        },
        item: {
            image: nftImages[11],
            title: '',
        },
        activity: { 
            icon: '', 
            title: 'Mint'
        }, 
        sentFrom: '0x3242...0b1', 
        sentTo: '0xF0sa...0b1', 
        revenue: '-', 
        cost: '0.0888', 
        gas: 0.00441, 
        otherFees: '-'
    },
    {
        date: 'Apr 5, 2022', 
        collection: {
            image: nftImages[12], 
            title: 'Starwolvez#23'
        }, 
        item: {
            image: nftImages[13],
            title: '',
        },
        activity: { 
            icon: '', 
            title: 'Mint'
        }, 
        sentFrom: '0x3242...0b1', 
        sentTo: '0xF0sa...0b1', 
        revenue: '-', 
        cost: '0.0888', 
        gas: 0.00441, 
        otherFees: '-'
    },
    {
        date: 'Apr 5, 2022', 
        collection: {
            image: nftImages[14], 
            title: 'Starwolvez#23'
        }, 
        item: {
            image: nftImages[15],
            title: '',
        },
        activity: { 
            icon: '', 
            title: 'Mint'
        }, 
        sentFrom: '0x3242...0b1', 
        sentTo: '0xF0sa...0b1', 
        revenue: '-', 
        cost: '0.0888', 
        gas: 0.00441, 
        otherFees: '-'
    },
    {
        date: 'Apr 5, 2022', 
        collection: {
            image: nftImages[16], 
            title: 'Starwolvez#23'
        }, 
        item: {
            image: nftImages[17],
            title: '',
        },
        activity: { 
            icon: '', 
            title: 'Mint'
        }, 
        sentFrom: '0x3242...0b1', 
        sentTo: '0xF0sa...0b1', 
        revenue: '-', 
        cost: '0.0888', 
        gas: 0.00441, 
        otherFees: '-'
    },
    {
        date: 'Apr 5, 2022', 
        collection: {
            image: nftImages[18], 
            title: 'Starwolvez#23'
        }, 
        item: {
            image: nftImages[19],
            title: '',
        },
        activity: { 
            icon: '', 
            title: 'Mint'
        }, 
        sentFrom: '0x3242...0b1', 
        sentTo: '0xF0sa...0b1', 
        revenue: '-', 
        cost: '0.0888', 
        gas: 0.00441, 
        otherFees: '-'
    }
]