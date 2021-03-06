import * as React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { ArrowBackRounded, CloseOutlined, CreditCardRounded, EditOutlined } from '@mui/icons-material';
import { COLOR } from '../../../../styles/Color';
import { Alert, Grid, Stack } from '@mui/material';
import OtpInput from 'react-otp-input';
import ErrorAlert from '../../Alert/Error';
import SuccessGIF from '../../../../images/success-otp.gif'
import Dashboard from '../../../containers/App/Dashboard/Dashboard';
import { Link } from 'react-router-dom';
import { resendOTP, verifyOTP } from '../../../actions/loginActions';
import axios from 'axios';
import SimpleLoader from '../../Loader/Loader';
import { useCookies } from 'react-cookie';

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 40,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

function SwipeOTPBox(props) {
    const [otp, setOtp] = React.useState([]);
    const [error, setError] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [load, setLoad] = React.useState(false);
    const [cookies, setCookie] = useCookies(['vt_customer', 'vt_channel', 'vt_auth_token']);

    const handleOTP = ()  => { 
      if (otp.length === 4){
      verifyOTP(otp, props.input ,props.identifier).then((response) => {
          console.log(JSON.stringify(response.data));
          localStorage.setItem("customerInfo", JSON.stringify(response.data))
          setCookie('vt_customer', response.data.customerId, { path: '/' })
          setCookie('vt_channel', 'DCO_APP', { path: '/' })
          setCookie('vt_auth_token', response.data.authToken, { path: '/' })
          // (`vt_customer=${response.data.customerId}; vt_channel=DCO_APP; vt_auth_token=${response.data.authToken}`)
          setError(false);
          setSuccess(true);
      }).catch((error) => {
          console.log(error.response.data);
          setError(true);
      })
      } else { setError(false) }
    }

    const reset = () => {
      setError(false);
      setSuccess(false);
      setOtp([]);
    }

    const newOtp = () => {
      setLoad(true)
      resendOTP(props.input, props.identifier).then((res) => {
        if(res.status === 200){
          setOtp([])
          setError(false)
          setLoad(false)
        }
        else{
         console.log('Failed to get otp')
         setLoad(false)
        }
    })
  }
  
  const handleClose = () => {
    setLoad(false);
  }

  return (
    <Root>
      {load && <SimpleLoader open={load} handleClose1={handleClose} />}
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(055% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
      <SwipeableDrawer
        anchor="bottom"
        open={props.open}
        onClose={props.close && reset}
        onOpen={props.open}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: false,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -23,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            visibility: 'visible',
            right: 0,
            left: 0,
            background: COLOR.BASE_COLOR4,
            // display: 'none'
          }}
        >
          {/* <Puller /> */}
          <div style={{display:'flex', alignItems: 'center', marginLeft: 15, justifyContent:'flex-end', padding: '10px 15px'}}>
            <CloseOutlined sx={{color: COLOR.PRIMARY_COLOR1}} onClick={props.close} />
          </div>

        </StyledBox>
        {!success &&   <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
            background: COLOR.BASE_COLOR4,
          }}
        >
          <Grid container sx={{pt: 2}} justifyContent="center" gap={2}>
            <Grid item alignItems={'center'} textAlign={'center'}>
                <Typography fontSize={20} fontWeight={600} letterSpacing={'1.5%'}>
                    Otp generated
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" marginTop={1}>
                    <Typography fontSize={12} fontWeight={400}>
                        Otp has been sent to <b> { props.input } </b> 
                    </Typography>
                    <EditOutlined sx={{color : COLOR.PRIMARY_COLOR1, fontSize: 15}} />
                </Stack>
            </Grid>
            <Grid item alignItems={'center'}>
            
            <OtpInput 
            onChange={(e) => setOtp(e)}
            numInputs={4}
            separator={<span> &nbsp; </span>}
            focusStyle={{
                //border: 'none'
            }}
            hasErrored={error ? true : false}
            errorStyle={{
                border: '2px solid #f23'
            }}
            isInputNum={true}
            inputStyle={{
                width: "50px",
                height: "50px",
                margin: "0 5px",
                fontSize: "2rem",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.3)",
                backgroundColor: "#fff", //03646377
                marginTop: 20
              }}
            value={otp}
            />
            <div style={{width: 100}}>
            <Typography fontSize={12} fontWeight={400} letterSpacing={'1.5%'} sx={{mt: 2, ml: 1, color: COLOR.TYPO_BASE3}} onClick={newOtp} textTransform={'uppercase'}>
                Resend otp
            </Typography>
            </div>
            
            {error &&  <ErrorAlert 
                            errorInfo={'Please enter correct otp'}
                            marginTop={2}
                          />
            }

            </Grid>
            <Grid item alignItems={'center'} sx={{position: 'absolute', bottom: 1}}>
            <Button
                variant='contained' 
                sx={{minWidth: '90vw', alignItems:"center", my: 5, minHeight: "6vh", background: COLOR.PRIMARY_COLOR1, color: COLOR.BASE_COLOR4 , borderRadius: 2,border: `1px solid ${COLOR.BASE_COLOR1}`,  boxShadow: ` 0px 4px 12px rgba(98, 98, 98, 0.06)`, 
                ":hover": {
                  bgcolor:COLOR.PRIMARY_COLOR1,
                  color:COLOR.BASE_COLOR4
                }
                }}
                disableElevation
                disabled={otp.length === 4 ? false : true}
                onClick={() => handleOTP()}
            >
                {!error ? 'Verify number' : 'Retry' }
            </Button>
            </Grid>
          </Grid>
        </StyledBox> }

        {success &&   <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
            background: COLOR.BASE_COLOR4,
          }}
        >
          <Grid container sx={{pt: 2}} justifyContent="center" gap={2}>
            <Grid item alignItems={'center'} textAlign={'center'}>
                <Typography fontSize={28} fontWeight={600} letterSpacing={'1.5%'}>
                    Success!
                </Typography>

            </Grid>
            <Grid item alignItems={'center'} display={"flex"} justifyContent={"center"} >
                <img src={SuccessGIF} alt="" width="52%" />
            </Grid>
            <Grid item alignItems={'center'} sx={{position: 'absolute', bottom: 1}}>
            <Button
                variant='contained' 
                sx={{minWidth: '90vw', alignItems:"center", my: 5, minHeight: "6vh", background: COLOR.PRIMARY_COLOR1, color: COLOR.BASE_COLOR4 , borderRadius: 2,border: `1px solid ${COLOR.BASE_COLOR1}`,  boxShadow: ` 0px 4px 12px rgba(98, 98, 98, 0.06)`, 
                  ":hover": {
                    bgcolor:COLOR.PRIMARY_COLOR1,
                    color:COLOR.BASE_COLOR4
                  }
                }}
                disableElevation
                // disabled={otp.length === 4 ? false : true}
                // onClick={() => handleOTP()}
                LinkComponent={Link}
                to="/dashboard"
                
            >
                { 'Enter dashboard' }
            </Button>
            </Grid>
          </Grid>
        </StyledBox> }
      </SwipeableDrawer>
    </Root>
  );
}


export default SwipeOTPBox;
