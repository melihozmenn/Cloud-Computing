import {  AppBar, Toolbar, Typography } from '@mui/material'
import React from 'react'

const Navbar = () => {
    return (
        <AppBar position="static" color='primary'>
            <Toolbar>
                <Typography variant="h6" color="inherit" component="div">
                    Bulut Bilişim - Melih Özmen
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar