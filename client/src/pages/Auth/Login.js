import React from 'react';
import { 
    Box, 
    Stack, 
    Button,
    Typography,
    OutlinedInput,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate, useResolvedPath } from 'react-router-dom';
import Wallet from './Wallet';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export default function Login () {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const navigate = useNavigate();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [show, setShow] = React.useState(false);

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const onShowPassword = () => {
        setShow(!show);
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        const user = {
            email: email,
            password: password
        }

        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/signin`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(data => {
            if (data.errors) {
                console.log(data.errors)
            } else {
                localStorage.setItem("token", data.token);
                window.location.href = '/dashboard';
            }
        })
        .catch(err => console.log(err))
    }

    return (
            <Stack flexDirection={matchUpMd ? "row" : "column-reverse" } alignItems="center">
                <Stack flex={1} sx={{ width: '100%' }}>
                    <Box
                        sx={{
                            maxWidth: 512,
                            width: '100%',
                            mx: 'auto',
                            textAlign: 'center',
                            py: matchUpMd ? 0 : 5,
                            px: 2,
                        }}
                    >
                        <Stack gap={2}>
                            <Typography variant="h2">Sign In To Your Account</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 400 }}>Welcome back! Please enter your login details below.</Typography>
                        </Stack>
                        <Stack 
                            component="form"
                            // method="post"
                            onSubmit={handleLogin}
                            gap={3}
                            sx={{
                                pt: 6
                            }}
                        >
                            <Stack gap={1}>
                                <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>Email Address</Typography>
                                <OutlinedInput 
                                    required
                                    placeholder='name@email.com'
                                    value={email}
                                    onChange={onChangeEmail}
                                    size='small'
                                    sx={{
                                        '& input': {
                                            fontSize: 16,
                                            py: 1.5
                                        }
                                    }}
                                />
                            </Stack>
                            <Stack gap={1}>
                                <Stack flexDirection="row" justifyContent="space-between">
                                    <Typography variant="subtitle1">Password</Typography>
                                    <Typography variant="subtitle1" sx={{ color: '#3C43FF' }}>Forgot Password?</Typography>
                                </Stack>
                                <OutlinedInput 
                                    size="small" 
                                    placeholder='Password'
                                    required 
                                    value={password}
                                    onChange={onChangePassword}
                                    type={show ? "text" : "password"}
                                    endAdornment={
                                        show 
                                        ?
                                            <VisibilityOffOutlinedIcon onClick={onShowPassword} sx={{ color: '#D7DCE3', cursor: 'pointer' }} />
                                        :
                                            <RemoveRedEyeOutlinedIcon onClick={onShowPassword} sx={{ color: '#D7DCE3', cursor: 'pointer' }} />
                                    }
                                    sx={{
                                        '& input': {
                                            fontSize: 16,
                                            py: 1.5
                                        }
                                    }}
                                />
                            </Stack>
                            <Button 
                                size="large"
                                variant="contained" 
                                type="submit"
                                sx={{ bgcolor: '#000' }}
                            >Sign In</Button>
                            <Box>
                                <Stack flexDirection="row" justifyContent="center">
                                    <Typography variant="subtitle1" sx={{ color: '#9DA7B5' }}>Don't have an account? </Typography>
                                    <Typography variant="subtitle1">
                                        <Link to="/signup"
                                            style={{
                                                textDecoration: 'none',
                                                color: '#3C43FF'
                                            }}
                                        >Sign Up</Link>
                                    </Typography>
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
                <Stack 
                    flex={1} 
                    alignItems="center"
                    sx={{ 
                        minHeight: matchUpMd ? '100vh' : 'unset',
                        py: matchUpMd ? 0 : 10, 
                        height: '100%',
                        width: '100%',
                        bgcolor: '#F2F4FD',
                    }}
                >
                    <Wallet/>
                </Stack>
            </Stack>
        // </Box>
    );
}