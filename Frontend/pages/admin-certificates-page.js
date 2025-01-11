import { useCallback } from "react";
import { Box, Button } from "@mui/material";
import Image from "next/image";
import FrameComponent2 from "../components/frame-component2";
import { useRouter } from "next/router";
import Background1 from "../components/background1";
import styles from "./admin-certificates-page.module.css";

const AdminCertificatesPage = () => {
  const router = useRouter();

  const onLeftMenuClick = useCallback(() => {
    router.push("/admin-project-page");
  }, [router]);

  const onProfileContainerClick = useCallback(() => {
    router.push("/profile-page-admin");
  }, [router]);

  const onSignOutContainerClick = useCallback(() => {
    router.push("/sign-in-screen-admin");
  }, [router]);

  return (
    <div className={styles.adminCertificatesPage}>
      <div className={styles.connectWallet}>
        <div className={styles.widthStructure}>
          <div className={styles.heightStructure}>
            <div className={styles.buttonBody}>
              <div className={styles.icon}>
                <div className={styles.div}></div>
              </div>
              <div className={styles.text}>Connect Wallet</div>
              <div className={styles.icon}>
                <div className={styles.div}></div>
              </div>
            </div>
          </div>
          <div className={styles.minwidth}>
            <div className={styles.content} />
          </div>
        </div>
      </div>
      <div className={styles.searchBar}>
        <Image
          className={styles.icon2}
          width={15}
          height={15}
          alt=""
          src="/icon.svg"
        />
        <div className={styles.addons}>Addons</div>
        <div className={styles.typeHere}>Type here...</div>
        <Image
          className={styles.passwordTextIcon}
          width={35}
          height={4}
          alt=""
          src="/password-text.svg"
        />
        <div className={styles.minwidth1}>
          <div className={styles.content1} />
        </div>
      </div>
      <FrameComponent2 />
      <section className={styles.menuBar}>
        <div className={styles.menuOptions}>
          <div className={styles.menuItems}>
            <div className={styles.firstMenu}>
              <div className={styles.homeMenu}>
                <div className={styles.homeLink}>
                  <div className={styles.homeIcon}>
                    <div className={styles.vectorParent}>
                      <Image
                        className={styles.frameChild}
                        width={30}
                        height={30}
                        alt=""
                        src="/rectangle-3.svg"
                      />
                      <Image
                        className={styles.homeIcon1}
                        loading="lazy"
                        width={21}
                        height={21}
                        alt=""
                        src="/home.svg"
                      />
                    </div>
                    <div className={styles.dashboardWrapper}>
                      <div className={styles.dashboard}>Dashboard</div>
                    </div>
                  </div>
                </div>
                <div className={styles.projectsMenu}>
                  <div className={styles.projectsLink}>
                    <div className={styles.signOut} onClick={onLeftMenuClick}>
                      <div className={styles.vectorParent}>
                        <div className={styles.projectImageChild} />
                        <Image
                          className={styles.leafIcon}
                          loading="lazy"
                          width={17}
                          height={16}
                          alt=""
                          src="/leaf.svg"
                        />
                      </div>
                      <div className={styles.projectName}>
                        <div className={styles.projects}>Projects</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.certificatesLink}>
                    <div className={styles.certificatesLinkChild} />
                    <div className={styles.certificatesIcon}>
                      <div className={styles.projectImageChild} />
                      <Image
                        className={styles.newspaperIcon}
                        width={20}
                        height={20}
                        alt=""
                        src="/newspaper.svg"
                      />
                    </div>
                    <div className={styles.certificatesWrapper}>
                      <div className={styles.certificates}>Certificates</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.accountMenu}>
                <div className={styles.accountPages}>
                  <div className={styles.accountPages1}>ACCOUNT PAGES</div>
                </div>
                <div className={styles.accountItems}>
                  <div
                    className={styles.profile}
                    onClick={onProfileContainerClick}
                  >
                    <div className={styles.accountIcons}>
                      <div className={styles.accountIconsChild} />
                      <Image
                        className={styles.ioniconppersondefault}
                        loading="lazy"
                        width={15}
                        height={15}
                        alt=""
                        src="/ioniconppersondefault.svg"
                      />
                    </div>
                    <div className={styles.dashboardWrapper}>
                      <div className={styles.profile1}>Profile</div>
                    </div>
                  </div>
                </div>
                <div className={styles.accountItems1}>
                  <div
                    className={styles.signOut}
                    onClick={onSignOutContainerClick}
                  >
                    <div className={styles.rectangleParent}>
                      <div className={styles.frameItem} />
                      <Image
                        className={styles.logOutOutlineIcon}
                        loading="lazy"
                        width={19}
                        height={20}
                        alt=""
                        src="/logoutoutline.svg"
                      />
                    </div>
                    <div className={styles.projectName}>
                      <div className={styles.projects}>Sign Out</div>
                    </div>
                  </div>
                </div>
                <div className={styles.background}>
                  <div className={styles.backgroundChild} />
                  <div className={styles.iconWrapper}>
                    <div className={styles.icon3}>
                      <div className={styles.iconChild} />
                      <Image
                        className={styles.ioniconhhelpcircle}
                        loading="lazy"
                        width={25}
                        height={24}
                        alt=""
                        src="/ioniconhhelpcircle.svg"
                      />
                    </div>
                  </div>
                  <div className={styles.helpTitleParent}>
                    <div className={styles.helpTitle}>
                      <div className={styles.needHelp}>Need help?</div>
                    </div>
                    <div className={styles.pleaseCheckOur}>
                      Please check our docs
                    </div>
                  </div>
                  <Button
                    className={styles.buttonbase}
                    disableElevation
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      color: "#2d3748",
                      fontSize: "12",
                      background: "#fff",
                      borderRadius: "12px",
                      "&:hover": { background: "#fff" },
                      height: 35,
                    }}
                  >
                    DOCUMENTATION
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Background1 />
        </div>
      </section>
    </div>
  );
};

export default AdminCertificatesPage;
