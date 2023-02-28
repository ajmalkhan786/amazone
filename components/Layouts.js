import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  Link,
  Menu,
  MenuItem,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Head from "next/head";
import React from "react";
import NextLink from "next/link";
import useStyles from "../utils/styles";
import { useContext } from "react";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { useState } from "react";
import dynamic from "next/dynamic";
// import { useRouter } from "next/router";

function Layouts({ title, description, children }) {
    // const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, user } = state;
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: "1.6rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      h2: {
        fontSize: "1.4rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
    },
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
    },
  });
  const classes = useStyles();
  const handleChangeMode = () => {
    dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
    const newDarkMode = !darkMode;
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
  };
  const handleloginMenu = (e) => {
    setAnchorEl(e.currentTarget)
  }
  const handleloginMenuClose = () => {
    setAnchorEl(null)
  }
  const handleLogout = () => {
    setAnchorEl(null)
    dispatch({type: 'USER_LOGOUT'})
    Cookies.remove('userInfo')
    Cookies.remove('cartItems')
    window.location.assign('/')
  }
  return (
    <Box>
      <Head>
        <title>{title ? `${title} - Amazona` : "Amazona"}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="sticky" className={classes.navbar}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>Amazona</Typography>
              </Link>
            </NextLink>
            <Box className={classes.grow}></Box>
            <Box>
              <Switch checked={darkMode} onChange={handleChangeMode} />
              <NextLink href="/cart" passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      overlap="rectangular"
                      badgeContent={cart.cartItems.length}
                      color="secondary"
                    >
                      Cart
                    </Badge>
                  ) : (
                    "Cart"
                  )}
                </Link>
              </NextLink>
              {user.userInfo ? (
                <>
                  <Button
                    className={classes.navBuitton}
                    aria-controls="login-menu"
                    aria-haspopup="true"
                    onClick={handleloginMenu}
                  >
                    {user.userInfo.name}
                  </Button>
                  <Menu
                    id="login-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleloginMenuClose}
                  >
                    <MenuItem onClick={handleloginMenuClose}>Profile</MenuItem>
                    <MenuItem onClick={handleloginMenuClose}>My account</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className={classes.footer}>
          <Typography>All right reserved. Amazona</Typography>
        </footer>
      </ThemeProvider>
    </Box>
  );
}


export default dynamic(() => Promise.resolve(Layouts), { ssr: false });