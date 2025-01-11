import { useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";
import Image from "next/image";
import NavigationMenu from "../components/navigation-menu";
import UserActions from "../components/user-actions";
import FrameComponent from "../components/frame-component";
import styles from "./profile-page-admin.module.css";

const ProfilePageAdmin = () => {
  const onConnectWalletClick = useCallback(() => {
    // Please sync "Admin Dashboard - Wallet Pop-up" to the project
  }, []);

  return (
    <div className={styles.profilePageAdmin}>
      <Image
        className={styles.passwordTextIcon}
        width={35}
        height={4}
        alt=""
        src="/password-text.svg"
      />
      <div className={styles.topNavigation}>
        <div className={styles.navigationContent}>
          <NavigationMenu />
        </div>
        <UserActions />
      </div>
      <section className={styles.actionButtons}>
        <div className={styles.connectWalletContainer}>
          <div className={styles.walletButtonWrapper}>
            <div className={styles.connectWalletButton}>
              <Button
                className={styles.connectWallet}
                disableElevation
                variant="contained"
                sx={{
                  textTransform: "none",
                  color: "#fff",
                  fontSize: "12",
                  background: "#0a3834",
                  borderRadius: "34.5px",
                  "&:hover": { background: "#0a3834" },
                  width: 150,
                }}
                onClick={onConnectWalletClick}
              >
                Connect Wallet
              </Button>
              <TextField
                className={styles.searchBar}
                placeholder="Type here..."
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <img width="15px" height="15px" src="/icon.svg" />
                  ),
                }}
                sx={{
                  "& fieldset": { borderColor: "#e2e8f0" },
                  "& .MuiInputBase-root": {
                    height: "39.5px",
                    backgroundColor: "#fff",
                    paddingLeft: "11.3px",
                    borderRadius: "15px",
                    fontSize: "14px",
                  },
                  "& .MuiInputBase-input": {
                    paddingLeft: "11.2px",
                    color: "#a0aec0",
                  },
                }}
              />
            </div>
            <div className={styles.settingsNotifications}>
              <div className={styles.settingsNotificationsIcons}>
                <Image
                  className={styles.ioniconssettingssharp}
                  loading="lazy"
                  width={12}
                  height={12}
                  alt=""
                  src="/ioniconssettingssharp.svg"
                />
                <Image
                  className={styles.ioniconssettingssharp}
                  loading="lazy"
                  width={12}
                  height={12}
                  alt=""
                  src="/ioniconnnotificationsdefault.svg"
                />
              </div>
            </div>
          </div>
          <div className={styles.profileHeaderWrapper}>
            <div className={styles.profileHeader}>
              <div className={styles.profileTitleContainer}>
                <h2 className={styles.myProfile}>My Profile</h2>
              </div>
              <div className={styles.profileImageContainer}>
                <Image
                  className={styles.profileImageIcon}
                  loading="lazy"
                  width={146}
                  height={146}
                  alt=""
                  src="/ellipse-10@2x.png"
                />
                <div className={styles.profileDetails}>
                  <div className={styles.profileDetailsChild} />
                  <div className={styles.profileInformation}>
                    <div className={styles.profileAttributes}>
                      <div className={styles.profileData}>
                        <FrameComponent />
                        <FrameComponent />
                        <FrameComponent />
                      </div>
                    </div>
                    <div className={styles.editProfile}>
                      <div className={styles.editButtonContainer}>
                        <div className={styles.editButtonWrapper}>
                          <div className={styles.editButtonAction}>
                            <div className={styles.minwidthParent}>
                              <div className={styles.minwidth}>
                                <div className={styles.content} />
                              </div>
                              <div className={styles.edit}>Edit</div>
                            </div>
                          </div>
                          <FrameComponent />
                          <div className={styles.passwordContainerWrapper}>
                            <FrameComponent />
                          </div>
                        </div>
                      </div>
                      <Image
                        className={styles.editIcon}
                        loading="lazy"
                        width={26}
                        height={25}
                        alt=""
                        src="/edit-icon.svg"
                      />
                    </div>
                  </div>
                  <Button
                    className={styles.profileDetailsItem}
                    disableElevation
                    variant="text"
                    sx={{
                      textTransform: "none",
                      color: "#fff",
                      fontSize: "12",
                      borderRadius: "0px 0px 0px 0px",
                      width: 176,
                      height: 35,
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePageAdmin;
