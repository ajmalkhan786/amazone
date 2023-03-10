import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    navbar: {
        backgroundColor: '#203040',
        '& a': {
            color: '#ffffff',
            marginLeft: 10,
        },       
    },
    brand: {
        fontSize: '1.5rem',
        fontWeight: 'bold'
    },
    grow: {
        flexGrow: 1
    },
    main: {
        minHeight: '80vh',
    },
    footer: {
        textAlign: 'center',
        marginTop: 10,
    },
    section: {
        marginTop: 10,
        marginBottom: 10,
    },
    form: {
        maxWidth: 800,
        margin: '0 auto'
    },
    navBuitton: {
        color: "#fff",
        textTransform: 'initial'
    },
    BgColor: {
        backgroundColor: 'transparent'
    },
    error : {
        color: 'f04040'
    },
    fullWidth: {
        width: '100%'
    }
})
export default useStyles