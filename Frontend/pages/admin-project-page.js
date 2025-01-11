import { Box } from "@mui/material";
import ProjectListCard from "../components/project-list-card";
import TopMenuBar from "../components/top-menu-bar";
import LeftMenuBar from "../components/left-menu-bar";
import AccountLeftMenu from "../components/account-left-menu";
import HelpBox from "../components/help-box";
import styles from "./admin-project-page.module.css";

const AdminProjectPage = () => {
  return (
    <div className={styles.adminProjectPage}>
      <ProjectListCard />
      <TopMenuBar />
      <LeftMenuBar />
      <AccountLeftMenu />
      <HelpBox />
    </div>
  );
};

export default AdminProjectPage;
