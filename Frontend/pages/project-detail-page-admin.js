import { useCallback } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import FrameComponent1 from "../components/frame-component1";
import { useRouter } from "next/router";
import UserActions from "../components/user-actions";
import FrameComponent from "../components/frame-component";
import Standards from "../components/standards";
import styles from "./project-detail-page-admin.module.css";

const ProjectDetailPageAdmin = () => {
  const router = useRouter();

  const onLeftMenuClick = useCallback(() => {
    router.push("/admin-certificates-page");
  }, [router]);

  return (
    <div className={styles.projectDetailPageAdmin}>
      <FrameComponent1 />
      <div className={styles.leftMenuParent}>
        <div className={styles.frameParent}>
          <div className={styles.frameGroup}>
            <div className={styles.frameContainer}>
              <div className={styles.frameWrapper}>
                <div className={styles.frameDiv}>
                  <div className={styles.vectorParent}>
                    <Image
                      className={styles.frameChild}
                      width={30}
                      height={30}
                      alt=""
                      src="/rectangle-3.svg"
                    />
                    <Image
                      className={styles.homeIcon}
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
              <div className={styles.rectangleParent}>
                <div className={styles.frameItem} />
                <div className={styles.projectsIcon}>
                  <div className={styles.projectsIconChild} />
                  <Image
                    className={styles.leafIcon}
                    loading="lazy"
                    width={17}
                    height={16}
                    alt=""
                    src="/leaf.svg"
                  />
                </div>
                <div className={styles.projectsWrapper}>
                  <div className={styles.projects}>Projects</div>
                </div>
              </div>
              <div className={styles.leftMenu1Wrapper}>
                <div className={styles.leftMenu1} onClick={onLeftMenuClick}>
                  <div className={styles.vectorParent}>
                    <div className={styles.projectsIconChild} />
                    <Image
                      className={styles.newspaperIcon}
                      loading="lazy"
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
            <UserActions />
          </div>
          <div className={styles.projectNameContainerWrapper}>
            <div className={styles.projectNameContainer}>
              <div className={styles.rectangleContainer}>
                <Image
                  className={styles.rectangleIcon}
                  width={381}
                  height={200}
                  alt=""
                  src="/rectangle-54@2x.png"
                />
                <div className={styles.uploadWrapper}>
                  <div className={styles.upload}>Upload</div>
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
              <div className={styles.rectangleParent1}>
                <div className={styles.rectangleDiv} />
                <FrameComponent />
                <div className={styles.regionCountry}>
                  <div className={styles.regionInput}>
                    <div className={styles.projectDescription}>
                      Project Description
                    </div>
                  </div>
                  <textarea
                    className={styles.name}
                    placeholder="A project focused on Miyawaki style tree plantation in urban areas with minimal spaces. The project has planted 1 lakh trees."
                    rows={8}
                    cols={18}
                  />
                </div>
                <div className={styles.projectTypeInputParent}>
                  <FrameComponent />
                  <FrameComponent />
                </div>
                <FrameComponent />
              </div>
            </div>
          </div>
        </div>
        <Standards />
      </div>
    </div>
  );
};

export default ProjectDetailPageAdmin;
