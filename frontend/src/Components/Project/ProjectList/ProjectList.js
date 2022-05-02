import React, { useState, useEffect } from 'react';
import ElimibugApi from '../../../api/api';
import ProjectCard from '../ProjectCard/ProjectCard';

import LoadingSpinner from '../../Common/LoadingSpinner/LoadingSpinner';

function ProjectList() {
  const [projects, setProjects] = useState(null);

  // When page loads, requests a list of all projects from API

  useEffect(function getprojectsOnMount() {
    find();
  }, []);

  // On find form submit, reload project list

  async function find() {
    let projects = await ElimibugApi.getProjects();

    setProjects(projects);
  }

  // Show spinner while waiting for API response

  if (!projects) return <LoadingSpinner />;

  return (
    <div className="ProjectList col-md-8 offset-md-2">
      {projects.length ? (
        <div>
          {projects.map((p) => (
            <ProjectCard key={p.project} name={p.project} count={p.count} />
          ))}
        </div>
      ) : (
        <p>No Projects found!</p>
      )}
    </div>
  );
}

export default ProjectList;
