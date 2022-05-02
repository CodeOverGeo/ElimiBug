import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ElimibugApi from '../../../api/api';
import BugCard from '../../Bug/BugCard/BugCard';
import NewBug from '../../Bug/NewBug/NewBug';
import LoadingSpinner from '../../Common/LoadingSpinner/LoadingSpinner';

function ProjectDetail() {
  const { name } = useParams();
  const [projects, setProjects] = useState(null);

  async function getProjectBug() {
    const projectBugs = await ElimibugApi.getProject(name);
    setProjects(projectBugs);
  }

  getProjectBug();

  if (!projects) return <LoadingSpinner />;

  return (
    <div>
      <div>
        <NewBug />
      </div>
      <div className="ProjectDetail col-md-4 offset-md-4">
        {projects.map((p) => (
          <BugCard
            key={p.id}
            id={p.id}
            bugName={p.bugName}
            project={p.project}
            description={p.description}
            priority={p.priority}
            lastStatus={p.lastStatus}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectDetail;
