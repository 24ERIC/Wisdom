import * as React from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Button,
    Tooltip,
    MenuItem,
    Link
} from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import HeaderBarCPU from './Header/HeaderBarCPU';
import HeaderBarSearch from './Header/HeaderBarSearch';


const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
export default function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" sx={{ background: "black" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Wisdom
                        </Typography>
                    </Link>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block', textTransform: 'none' }}>
                            <Link href="/search" sx={{ textDecoration: 'none', color: 'rgba(200, 200, 200, 0.8)', fontSize: '30px', '&:hover': { color: 'white' } }}>Search</Link>
                        </Button>
                        <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block', textTransform: 'none' }}>
                            <Link href="/plan" sx={{ textDecoration: 'none', color: 'rgba(200, 200, 200, 0.8)', fontSize: '30px', '&:hover': { color: 'white' } }}>Plan</Link>
                        </Button>
                        <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block', textTransform: 'none' }}>
                            <Link href="/blogs" sx={{ textDecoration: 'none', color: 'rgba(200, 200, 200, 0.8)', fontSize: '30px', '&:hover': { color: 'white' } }}>Blogs</Link>
                        </Button>
                        <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block', textTransform: 'none' }}>
                            <Link href="/tools" sx={{ textDecoration: 'none', color: 'rgba(200, 200, 200, 0.8)', fontSize: '30px', '&:hover': { color: 'white' } }}>Tools</Link>
                        </Button>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <HeaderBarSearch />
                    <HeaderBarCPU />
                </Toolbar>
            </Container>
        </AppBar>
    );
}
