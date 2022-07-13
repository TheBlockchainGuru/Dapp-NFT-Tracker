import * as React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from "react-query";
import {
    Box,
    Button,
    Stack,
    Skeleton,
    Tab,
    Tabs,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BlockUi from 'react-block-ui';
import { CSVLink, CSVDownload } from 'react-csv';
import { getTransactionInformation } from '../../utils/web3utils';
import { useNavigate } from 'react-router-dom';

import Info from './Info';
import History from './History';
import Gains from './Gains';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import 'react-notifications/lib/notifications.css';

const query = `
query Wallet($address: String) {
    wallet(address: $address) {
      address
      logs {
        edges {
          node {
            blockNumber
            fromAddress
            toAddress
            estimatedConfirmedAt
            transactionHash
            contract {
              ... on ERC721Contract {
                unsafeOpenseaSlug
                unsafeOpenseaImageUrl
                unsafeOpenseaBannerImageUrl
                name
              }
            }
            type
            contractAddress
            transactionCreator
            token {
              ... on ERC721Token {
                name
                tokenId
              }
              images {
                url
              }
            }
          }
        }
      }
    }
  }
`

function TabPanel(props) {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const { children, value, index, ...other } = props;
  
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
            <Box sx={{ py: matchUpMd ? 3 : 0 }}>
                {children}
            </Box>
            )}
        </div>
    );
}
  
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Dashboard () {
    const theme = useTheme();
    const navigate = useNavigate();
    const [value, setValue] = React.useState(0);
    const [nfts, setNfts] = React.useState({nfts: [], nftCount: 0});
    const { isLoading, wallets, wallet } = useSelector((state) => state.userReducer);
    const {
        timeFrame,
        perPage,
        currentPage,
        gainType,
        actionType,
        pageIndex
    } = useSelector(state => state.userReducer);
    const [gain, setGainType] = React.useState(gainType.toString());
    const [frame, setFrame] = React.useState(timeFrame.toString())
    const [unit, setUnit] = React.useState('eth');
    const [data, setData] = React.useState([]);
    const [realData, setRealData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const dispatch = useDispatch();

    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const matchUpSm = useMediaQuery(theme.breakpoints.up('sm'));

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    // const { data } = useQuery("launches", async () => {
    //     setLoading(true)
    //     if (wallets.length) {
    //         console.log(wallets);
    //         return []
            
    //     } else {
    //         return [];
    //     }
        
    // }, {
    //     refetchOnWindowFocus: false,
    //     staleTime: 0,
    //     cacheTime: 0,
    //     refetchInterval: 0
    // });
    
    const onChangeTimeFrame = (element, frame) => {
        const newData = data.filter((element) => {
            if (
                ((new Date().getTime()) - 
                (new Date(element.node.estimatedConfirmedAt).getTime())) >
                (frame * 24 * 60 * 60000)
            ) return false;
            else return true;
        })
        setRealData(newData)
        setFrame(frame)
        dispatch({ type: 'SET_TIMEFRAME', payload: parseInt(frame) });
        dispatch({ type: 'SET_CURRENT_PAGE', payload: 1 });
    }

    const onChangeGainType = (element, gt) => {
        setGainType(gt)
    }

    const onChangeUnit = (element, u) => {
        setUnit(u)
    }

    React.useEffect(() => {
        async function checkLogin () {
            setLoading(true);
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/isAuth`, {
                headers: {
                    "Content-type": "application/json",
                    "x-access-token": localStorage.getItem("token"),
                },
            })
            .then(res => res.json())
            .then(async (res) => {
                if (!res.isLoggedIn) {
                    // navigate('/login');
                    window.location.href = "/login"
                } else {
                    if (wallet !== '') {
                        const response = await axios({
                            url: process.env.REACT_APP_ICY_TOOLS_END_POINT,
                            method: 'POST',
                            headers: {
                                'x-api-key': process.env.REACT_APP_ICY_TOOLS_KEY
                            },
                            data: {
                                query: query,
                                variables: {
                                    // address: '0x8a945A97eB7eEeB4B7240B7C014C6F8410867E66'
                                    address: wallet
                                }
                            }
                        })
                        if (response.data.data.wallet) {
                            const transfers = response.data.data.wallet.logs.edges;
                            for (let i in transfers) {
                                console.log(i)
                                const transfer = transfers[i];
                                const cost = await getTransactionInformation(transfer.node.transactionHash)
                                transfers[i].node.value = cost.value;
                                transfers[i].node.gasprice = cost.gasprice;
                                transfers[i].node.gastotal = cost.gastotal;
                            }
                            const sort = transfers.sort((a, b) => {
                                return (new Date(b.node.estimatedConfirmedAt).getTime()) - (new Date(a.node.estimatedConfirmedAt).getTime())
                            })
                            setData(sort)
                            if (sort) {
                                const newData = sort.filter((element) => {
                                    if (
                                        ((new Date().getTime()) - 
                                        (new Date(element.node.estimatedConfirmedAt).getTime())) >
                                        (frame * 24 * 60 * 60000)
                                    ) return false;
                                    else return true;
                                })
                                setRealData(newData)
                            } 
                        } else {
                            setData([])
                            setRealData([])
                        }
                        
                    } else {
                    }
                }
                setLoading(false)
            })
            .catch(err => console.log(err))
        }

        checkLogin();
    }, [frame, wallet])

    return (
        <Box>
            <Box 
                sx={{
                    pt: 16,
                    maxWidth: 1366,
                    px: 2,
                    mx: 'auto'
                }}
            >
                <Info nfts={data ? data : []} loading={loading} />
                <Box sx={{ width: '100%' }}>
                    <Stack 
                        flexDirection="row"
                        justifyContent="space-between" 
                        sx={{ 
                            borderBottom: 1, 
                            borderColor: 'divider' 
                        }}
                    >
                        <Tabs 
                            value={value} 
                            onChange={handleChange} 
                            aria-label="basic tabs example"
                            textColor="primary"
                        >
                            <Tab label="History" {...a11yProps(0)} />
                            <Tab label="Realized Gains" {...a11yProps(1)} />
                        </Tabs>
                        <Stack flexDirection="row" alignItems="center" gap={1}
                            sx={{
                                display: matchUpMd ? 'flex' : 'none'
                            }}
                        >
                            {value == 1 
                            ?   
                                <Stack flexDirection="row" alignItems="center" gap={1}>
                                    <Typography variant="subtitle2">Gain Type:</Typography>
                            
                                    <Box component="select"
                                        sx={{
                                            color: '#18181B',
                                            borderColor: '#D7DCE3',
                                            borderRadius: 1,
                                            p: .75,
                                        }}
                                        onChange={onChangeGainType}
                                        value={gain}
                                    >
                                        <option value={10}>All</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </Box>
                                    <ToggleButtonGroup 
                                        size="small"
                                        value={unit}
                                        sx={{ '& button': {py: 0.5 } }}
                                    >
                                        <ToggleButton 
                                            value="eth" 
                                            sx={{ px: 4 }}
                                            onClick={() => {
                                                setUnit('eth')
                                            }}
                                        >ETH</ToggleButton>
                                        <ToggleButton 
                                            value="taxable" 
                                            sx={{ px: 4 }}
                                            onClick={() => {
                                                setUnit('taxable')
                                            }}
                                        >Taxable</ToggleButton>
                                    </ToggleButtonGroup>
                                </Stack>
                            :   <></>
                            }
                            <ToggleButtonGroup 
                                size='small' 
                                value={frame} 
                                exclusive 
                                onChange={onChangeTimeFrame}
                                sx={{
                                    '& button': {
                                        py: .5
                                    }
                                }}
                            >
                                <ToggleButton value="7">1W</ToggleButton >
                                <ToggleButton value="31">1M</ToggleButton >
                                <ToggleButton value="93">3M</ToggleButton >
                                <ToggleButton value="365">1Y</ToggleButton >
                                <ToggleButton value="5000">ALL</ToggleButton >
                            </ToggleButtonGroup>
                            <CSVLink data={realData} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                <Button variant="outlined" size="small" sx={{ borderColor: '#9DA7B5' }}>
                                    <FileDownloadOutlinedIcon fontSize="small" sx={{ color: '#9DA7B5' }} />
                                    <Typography variant="subtitle2" sx={{ pl: .5, color: '#9DA7B5' }}>Export CSV</Typography>
                                </Button>
                            </CSVLink>
                        </Stack>
                    </Stack>
                    <Stack alignItems="flex-start" gap={1}
                        sx={{
                            display: matchUpMd ? 'none' : 'flex',
                            py: 1
                        }}
                    >
                        {value == 1 
                        ?   
                            <Stack flexDirection={ matchUpSm ? "row" : "column" } alignItems="flex-start" gap={1}>
                                <Stack flexDirection="row" alignItems="center">
                                    <Typography variant="subtitle2">Gain Type:</Typography>
                            
                                    <Box component="select"
                                        sx={{
                                            color: '#18181B',
                                            borderColor: '#D7DCE3',
                                            borderRadius: 1,
                                            p: .75,
                                        }}
                                        onChange={onChangeGainType}
                                        value={gain}
                                    >
                                        <option value={10}>All</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </Box>
                                </Stack>
                                <ToggleButtonGroup 
                                    size="small" 
                                    value={unit}
                                    sx={{ '& button': {py: 0.5 } }}
                                >
                                    <ToggleButton 
                                        value="eth" 
                                        sx={{ px: 4 }}
                                        onClick={() => setUnit('eth')}
                                    >ETH</ToggleButton>
                                    <ToggleButton 
                                        value="taxable" 
                                        sx={{ px: 4 }}
                                        onClick={() => setUnit('taxable')}
                                    >Taxable</ToggleButton>
                                </ToggleButtonGroup>
                            </Stack>
                        :   <></>
                        }
                        <Stack flexDirection="row" alignItems="center" gap={1}>
                            <ToggleButtonGroup 
                                size='small' 
                                value={frame} 
                                exclusive 
                                onChange={onChangeTimeFrame}
                                sx={{
                                    '& button': {
                                        py: .5
                                    }
                                }}
                            >
                                <ToggleButton value="7">1W</ToggleButton >
                                <ToggleButton value="31">1M</ToggleButton >
                                <ToggleButton value="93">3M</ToggleButton >
                                <ToggleButton value="365">1Y</ToggleButton >
                                <ToggleButton value="5000">ALL</ToggleButton >
                            </ToggleButtonGroup>
                            <CSVLink data={nfts.nfts} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                                <Button variant="outlined" size="small" sx={{ borderColor: '#9DA7B5' }}>
                                    <FileDownloadOutlinedIcon fontSize="small" sx={{ color: '#9DA7B5' }} />
                                    <Typography variant="subtitle2" sx={{ pl: .5, color: '#9DA7B5' }}>Export CSV</Typography>
                                </Button>
                            </CSVLink>
                        </Stack>
                    </Stack>
                    <TabPanel value={value} index={0}>
                        <History nfts={realData} loading={loading} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Gains nfts={realData} loading={loading} data={data} />
                    </TabPanel>
                </Box>
            </Box>
        </Box>
    );
}