import React, { useSyncExternalStore } from 'react';
import { 
    Box, 
    Stack, 
    Button,
    Typography,
    OutlinedInput,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import Wallet from './Wallet';
import SearchIcon from '@mui/icons-material/Search';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

export default function Signup () {
    const theme = useTheme();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const navigate = useNavigate();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [password_confirmation, setPasswordConfirmation] = React.useState('');
    const [show, setShow] = React.useState(false);
    const [confirm, setConfirm] = React.useState(false);

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const onChangePasswordConfirmation = (e) => {
        setPasswordConfirmation(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const onShowPassword = (e) => {
        setShow(!show);
    }

    const onShowConfirm = (e) => {
        setConfirm( !confirm);
    }

    const handleSignup = async (e) => {
        e.preventDefault();

        // When a post request is sent to the create url, we'll add a new record to the database.
        const newUser = {
            name: 'Default name',
            email: email,
            password: password,
            password_confirmation: password_confirmation
        };
        
        await fetch(`${process.env.REACT_APP_SERVER_URL}/api/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        })
        .then(data => {
            navigate("/login");
        })
        .catch(error => {
          window.alert(error);
          return;
        });
    
        // setForm({ name: "", position: "", level: "" });
    }
    return (
        <Stack flexDirection={ matchUpMd ? "row" : "column-reverse" } alignItems="center">
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
                        <Typography variant="h2">Join Tallyup</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 400 }}>Create a free account below.</Typography>
                    </Stack>
                    <Stack 
                        component="form"
                        onSubmit={handleSignup}
                        gap={3}
                        sx={{
                            pt: 6
                        }}
                    >
                        <Stack gap={1}>
                            <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>Email Address</Typography>
                            <OutlinedInput 
                                placeholder='name@email.com'
                                required
                                size='small'
                                value={email}
                                onChange={onChangeEmail}
                                sx={{
                                    // width: '100%',
                                    '& input' : {
                                        fontSize: 16,
                                        py: 1.5
                                    }
                                }}
                            />
                        </Stack>
                        <Stack gap={1}>
                            <Stack flexDirection="row" justifyContent="space-between">
                                <Typography variant="subtitle1">Password</Typography>
                                <Typography variant="subtitle1" sx={{ color: '#9DA7B5', fontWeight: 400 }}>Must be at least 8 characters</Typography>
                            </Stack>
                            <OutlinedInput 
                                placeholder='Password'
                                required
                                size="small"
                                value={password}
                                type={show ? "text" : "password"}
                                inputProps={{ minLength: 8 }}
                                onChange={onChangePassword}
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
                        <Stack gap={1}>
                            <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>Confirm Password</Typography>
                            <OutlinedInput 
                                placeholder='Retype Password'
                                required
                                size='small'
                                value={password_confirmation}
                                type={confirm ? "text" : "password"}
                                onChange={onChangePasswordConfirmation}
                                endAdornment={
                                    confirm 
                                    ?
                                        <VisibilityOffOutlinedIcon onClick={onShowConfirm} sx={{ color: '#D7DCE3', cursor: 'pointer' }} />
                                    :
                                        <RemoveRedEyeOutlinedIcon onClick={onShowConfirm} sx={{ color: '#D7DCE3', cursor: 'pointer' }} />
                                }
                                sx={{
                                    '& input': {
                                        fontSize: 16,
                                        py: 1.5
                                    }
                                }}
                            />
                        </Stack>
                        <Button size="large" type="submit" variant="contained" sx={{ bgcolor: '#000' }}>Sign Up</Button>
                        <Box>
                            <Stack flexDirection="row" justifyContent="center">
                                <Typography variant="subtitle1" sx={{ color: '#9DA7B5' }}>Already have an account? </Typography>
                                <Typography variant="subtitle1">
                                    <Link to="/login" 
                                        style={{ 
                                            textDecoration: 'none', 
                                            color: '#3C43FF'
                                        }}
                                    > Sign In</Link>
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
    );
}