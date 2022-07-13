import * as React from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Container,
    Button,
    Stack,
    Typography,
    Menu,
    MenuItem,
    OutlinedInput
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import LogoImage from '../assets/img/Tallup.png';
import WalletImage from '../assets/img/wallet.png';
import MetamaskImage from '../assets/img/metamask.png';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeWalletAddress } from '../utils';

import {NotificationContainer, NotificationManager} from 'react-notifications';
export default function Header () {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [error, setErrorMessage] = React.useState('');
    const [isAdding, setIsAdding] = React.useState(false);
    const [walletTitle, setWallet] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [userId, setUserId] = React.useState('');

    const dispatch = useDispatch();
    const open = Boolean(anchorEl);

    const { isLogin, wallets, wallet } = useSelector((state) => state.userReducer)
    const navigate = useNavigate();
    const location = useLocation();

    const onAuth = (loginState) => {
        dispatch({ type: 'AUTH', payload: loginState });
        localStorage.removeItem("token");
        window.location.href = "login";
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (element, address) => {
        setAnchorEl(null);
        dispatch({type: 'SET_WALLET', payload: address})
    };

    const onSetAdding = (event) => {
        setIsAdding(event);
    }

    const onChangeAddress = (element) => {
        setAddress(element.target.value)
    }

    const onChangeWallet = (element) => {
        setWallet(element.target.value)
    }

    const onAddWallet = () => {
        const newWallet = {
            title: walletTitle,
            address: address,
            userId: userId
        }
        fetch(`${process.env.REACT_APP_SERVER_URL}/wallet/create`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(newWallet)
        })
        // .then(res => res.json())
        .then(data => {
            dispatch({type: 'ADD_WALLET', payload: {wallet: walletTitle, address: address}})
            dispatch({type: 'SET_WALLET', payload: address})
        })
        .catch(err => setErrorMessage(err))

        setAddress('')
        setWallet('')
        onSetAdding(false)
    }

    React.useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/isAuth`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-type": "application/json"
            },
        })
        .then(res => res.json())
        .then(data => {
            dispatch({ type: 'AUTH', payload: data.isLoggedIn })
            setUserId(data.userId);
     
            fetch(`${process.env.REACT_APP_SERVER_URL}/wallet/wallets`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({userId: data.userId})
            })
            .then(res => res.json())
            .then(data => {
                for(let one of data) {
                    if(wallets.findIndex(e => e.address == one.address) < 0) {
                        dispatch({ type: 'ADD_WALLET', payload: one})
                    }
                }

                if (data.length) {
                    dispatch({type: 'SET_WALLET', payload: data[0].address})
                } else {
                    
                    // NotificationManager.error('Error message', 'Click me!', 5000, () => {
                    //     alert('callback');
                    // });
                }
            })
            .catch(err => setErrorMessage(err))
        })
    }, [])
    
    return (
        <AppBar 
            // position="fixed" 
            sx={{ 
                bgcolor: location.pathname != "/" ? '#FFF' : 'transparent',
                boxShadow: 'none',
                py: 2,
                borderBottom: location.pathname != '/' ? "1px solid #E3E3E3" : 'none'
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters 
                    sx={{ 
                        justifyContent: "space-between" 
                    }} 
                >
                    <Box 
                        component="img" 
                        src={LogoImage} 
                        sx={{ mr: 2 }}
                    />
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    {isLogin === false 
                    ? 
                        <Stack 
                            flexDirection="row"
                            alignItems="center"
                            gap={1}
                            sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {!location.pathname.includes('login') && ! isLogin
                        ?
                            <Button 
                                onClick={ () => navigate('/login') }
                                // onClick={() => onAuth(true)}
                                sx={{ color: '#000000', py: 1, px: 4 }}>
                            Sign In
                            </Button>
                        :   
                            <></>
                        }
                        {!location.pathname.includes('signup') && ! isLogin
                        ?
                            <Button onClick={ () => navigate('/signup') } variant="contained" sx={{ bgcolor: '#000', py: 1, px: 4 }}>Sign Up</Button>
                        :
                            <></>
                        }
                        </Stack>
                    :
                        <Stack
                            flexDirection="row"
                            alignItems="center"
                            gap={2}
                        >
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                startIcon={
                                    <Stack
                                        sx={{
                                            bgcolor: '#FFFFFF',
                                            borderRadius: 1,
                                            p: 1,
                                            flex: 1
                                        }}
                                    >
                                        <Box sx={{ width: 16, height: 16 }} component="img" src={WalletImage} />
                                    </Stack>
                                }
                                endIcon={
                                    <Stack flex={2}>
                                        <ArrowDropDownIcon />
                                    </Stack>
                                }

                                sx={{
                                    bgcolor: '#F2F4FD',
                                    px: 1.5,
                                    width: 290,
                                    
                                    display: {xs: 'none', md: 'flex'}
                                }}
                            >
                                <Stack flex={4} alignItems="flex-start">
                                    <Typography 
                                        sx={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            lineHeight: 1.35
                                        }}
                                    >Display All Wallets</Typography>
                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            color: '#9DA7B5'
                                        }}
                                    >{wallets.length > 1 ? wallets.length + ' Wallets' : wallets.length + ' Wallet'} Connected</Typography>
                                </Stack>
                            </Button>
                            {!isAdding
                            ?
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={() => setAnchorEl(null)}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                    sx={{
                                        '& .MuiList-root': {
                                            py: 0,
                                            '& .MuiMenuItem-root': {
                                                p: 0
                                            }
                                        }
                                    }}
                                >
                                {wallets.map((ele, key) => 
                                    <MenuItem key={key}>
                                        <Button
                                            onClick={element => handleClose(element, ele.address)}
                                            startIcon={
                                                <Stack
                                                    sx={{
                                                        bgcolor: '#FFFFFF',
                                                        borderRadius: 1,
                                                        p: 1,
                                                        flex: 1
                                                    }}
                                                >
                                                    <Box sx={{ width: 16, height: 16 }} component="img" src={MetamaskImage} />
                                                </Stack>
                                            }
                                            endIcon={
                                                <Stack flexDirection="row" alignItems="center" flex={2} gap={1}>
                                                    <EditIcon fontSize='small' sx={{ color: '#9DA7B5' }} />
                                                    <DeleteIcon fontSize='small' sx={{ color: '#9DA7B5' }}  />
                                                </Stack>
                                            }

                                            sx={{
                                                bgcolor: ele.address === wallet ? '#F2F4FD' : 'transparent',
                                                px: 1.5,
                                                width: 290,
                                                borderRadius: 0
                                            }}
                                        >
                                            <Stack alignItems="flex-start" flex={4}>
                                                <Typography 
                                                    sx={{
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        lineHeight: 1.35
                                                    }}
                                                >{ele.title}</Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: 10,
                                                        color: '#9DA7B5',
                                                    }}
                                                >{makeWalletAddress(ele.address)}</Typography>
                                            </Stack>
                                        </Button>
                                    </MenuItem>
                                )}
                                    <MenuItem>
                                        <Box
                                            sx={{
                                                p: 1,
                                                width: 290,
                                            }}
                                        >
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                onClick={() => onSetAdding(true) }
                                                sx={{
                                                    borderStyle: 'dashed',
                                                    '&:hover' : {
                                                        borderStyle: 'dashed',
                                                    }
                                                }}

                                            >
                                                <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>Add Wallet</Typography>
                                            </Button>
                                        </Box>
                                    </MenuItem>
                                </Menu>
                            :
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={() => setAnchorEl(null)}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                    sx={{
                                        '& .MuiList-root': {
                                            py: 0,
                                            '& .MuiMenuItem-root': {
                                                p: 0
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem>
                                        <Box sx={{ p: 1, width: 290 }}>
                                            <OutlinedInput 
                                                size='small' 
                                                fullWidth
                                                placeholder="Wallet Name"
                                                value={walletTitle}
                                                onChange={onChangeWallet}
                                                sx={{ '& input': { fontSize: 14 } }}
                                            />
                                        </Box>
                                    </MenuItem>
                                    <MenuItem>
                                        <Box sx={{ p: 1, width: 290 }}>
                                            <OutlinedInput 
                                                size='small'
                                                fullWidth
                                                placeholder="Wallet Address"
                                                value={address}
                                                onChange={onChangeAddress}
                                                sx={{ '& input': { fontSize: 14 } }}
                                            />
                                        </Box>
                                    </MenuItem>
                                    <MenuItem>
                                        <Box
                                            sx={{
                                                p: 1,
                                                width: 290,
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={onAddWallet}

                                            >
                                                <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>Add</Typography>
                                            </Button>
                                        </Box>
                                    </MenuItem>
                                </Menu>
                            }
                            <Button 
                                variant="outlined"
                                onClick={() => onAuth(false)}
                                sx={{ color: '#000000', py: 1, px: 4 }}
                            >Logout</Button>
                        </Stack>
                    }
                </Toolbar>
            </Container>
            <NotificationContainer/>
        </AppBar>
    );
  };