import React, { useCallback } from 'react';
import { Box, Typography, Paper, styled, Button } from '@mui/material';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from "./project-list-card.module.css";


const PROJECTS = [
  {
    id: '00023',
    title: 'Project Title 1',
    type: 'Project Type',
    location: 'Asia/India',
    area: '20,000',
    price: '20 ADA',
    vintageFrom: '2022',
    vintageTo: '2023',
    standard: 'Standard Name',
    logoSrc: '/logo-11@2x.png',
  },
  // Add more sample projects here...
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  width: "1132px",
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 17,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 3.5px 5.5px rgba(0, 0, 0, 0.02)',
    backgroundColor: theme.palette.background.paper,
  }
}));

const HeaderTypography = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(14),
  fontWeight: 'bold',
  lineHeight: '150%',
  color: theme.palette.text.secondary,
}));

const ProjectListCard = () => {
  const router = useRouter();

  const onViewProject = useCallback((id: string) => {
    router.push(`/project-detail-page-admin?id=${id}`);
  }, [router]);

  const onApprove = useCallback((id: string) => {
    console.log(`Approved project ${id}`);
  }, []);

  const onReject = useCallback((id: string) => {
    console.log(`Rejected project ${id}`);
  }, []);

  return (
    <div className={styles.projectListCard}>
      <StyledPaper elevation={3}>
        <Typography variant="h5" gutterBottom sx={{ position: 'relative', zIndex: 1 }}>Projects</Typography>
        <Box display="flex" fontWeight="bold" py={2} borderBottom="2px solid #000" sx={{ position: 'relative', zIndex: 1 }}>
          <HeaderTypography sx={{ width: '10%' }}>Project ID</HeaderTypography>
          <HeaderTypography sx={{ width: '20%' }}>Project</HeaderTypography>
          <HeaderTypography sx={{ width: '10%' }}>Project Type</HeaderTypography>
          <HeaderTypography sx={{ width: '10%' }}>Standard</HeaderTypography>
          <HeaderTypography sx={{ width: '10%' }}>Vintage From</HeaderTypography>
          <HeaderTypography sx={{ width: '10%' }}>Vintage To</HeaderTypography>
          <HeaderTypography sx={{ width: '10%' }}>Region, Country</HeaderTypography>
          <HeaderTypography sx={{ width: '5%' }}>Qty</HeaderTypography>
          <HeaderTypography sx={{ width: '5%' }}>Price per unit</HeaderTypography>
          <HeaderTypography sx={{ width: '10%' }}>Accept/ Reject</HeaderTypography>
        </Box>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {PROJECTS.map((project) => (
            <ProjectItem
              key={project.id}
              {...project}
              onViewProject={onViewProject}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))}
        </Box>
      </StyledPaper>
    </div>
  );
};

export default ProjectListCard;



interface ProjectItemProps {
  id: string;
  title: string;
  type: string;
  location: string;
  area: string;
  price: string;
  vintageFrom: string;
  vintageTo: string;
  standard: string;
  logoSrc: string;
  onViewProject: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const ItemTypography = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(12),
  lineHeight: '140%',
  color: theme.palette.text.secondary,
}));

const ActionButton = styled(Button)(({ theme, color }) => ({
  borderRadius: theme.shape.borderRadius,
  fontSize: theme.typography.pxToRem(12),
  padding: theme.spacing(0.5, 1),
  minWidth: 76,
  height: 26,
}));

const ProjectItem: React.FC<ProjectItemProps> = ({
  id,
  title,
  type,
  location,
  area,
  price,
  vintageFrom,
  vintageTo,
  standard,
  logoSrc,
  onViewProject,
  onApprove,
  onReject,
}) => {
  return (
    <Box display="flex" alignItems="center" py={2} borderBottom="1px solid #e0e0e0">
      <ItemTypography sx={{ width: '10%' }}>{id}</ItemTypography>
      <Box sx={{ width: '20%', display: 'flex', alignItems: 'center' }}>
        <Image src={logoSrc} alt={title} width={30} height={30} style={{ borderRadius: '4px' }} />
        <ItemTypography ml={1}>{title}</ItemTypography>
      </Box>
      <ItemTypography sx={{ width: '10%' }}>{type}</ItemTypography>
      <ItemTypography sx={{ width: '10%' }}>{standard}</ItemTypography>
      <ItemTypography sx={{ width: '10%' }}>{vintageFrom}</ItemTypography>
      <ItemTypography sx={{ width: '10%' }}>{vintageTo}</ItemTypography>
      <ItemTypography sx={{ width: '10%' }}>{location}</ItemTypography>
      <ItemTypography sx={{ width: '5%' }}>{area}</ItemTypography>
      <ItemTypography sx={{ width: '5%' }}>{price}</ItemTypography>
      <Box sx={{ width: '10%', display: 'flex', justifyContent: 'space-between' }}>
        <ActionButton
          variant="contained"
          color="primary"
          onClick={() => onApprove(id)}
        >
          Approve
        </ActionButton>
        <ActionButton
          variant="outlined"
          color="secondary"
          onClick={() => onReject(id)}
        >
          Reject
        </ActionButton>
      </Box>
    </Box>
  );
};


