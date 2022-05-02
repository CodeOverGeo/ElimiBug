'use strict';

const db = require('../db');
const { BadRequestError, NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');

/** Related functions for bug. */

class Bug {
  /** Create a bug (from data), update db, return new bug data.
   *
   * data should be { bug_name, project, description, priority, last_status }
   *
   * Returns { project, description, priority, last_status }
   *
   * Throws BadRequestError if bug already in database.
   * */

  static async create({
    bugName,
    project,
    description,
    priority,
    last_status,
  }) {
    const duplicateCheck = await db.query(
      `SELECT bug_name
           FROM bug
           WHERE bug_name = $1`,
      [bugName]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate bug: ${bugName}`);

    const result = await db.query(
      `INSERT INTO bug
           (bug_name, project, description, priority, last_status)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, bug_name AS "bugName", project, description, priority, last_status AS "lastStatus"`,
      [bugName, project, description, priority, last_status]
    );
    const bug = result.rows[0];

    return bug;
  }

  /** Find all bugs (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - priority
   * - status
   * - name
   *
   *
   *
   * Returns [{ id, bug_name, project, description, priority, last_status }, ...]
   * */

  static async findAll(searchFilters = {}) {
    let query = `SELECT id,
                        bug_name AS "bugName",
                        project,
                        description,
                        priority,
                        last_status AS "lastStatus"
                 FROM bug`;
    let whereExpressions = [];
    let queryValues = [];

    const { project, priority, lastStatus, bugName } = searchFilters;

    // For each possible search term, add to whereExpressions and queryValues so
    // we can generate the right SQL

    if (priority) {
      queryValues.push(`${priority}`);
      whereExpressions.push(`priority = $${queryValues.length}`);
    }

    if (lastStatus !== undefined) {
      queryValues.push(`${lastStatus}`);
      whereExpressions.push(`last_status = $${queryValues.length}`);
    }

    if (project) {
      queryValues.push(`${project}`);
      whereExpressions.push(`project = $${queryValues.length}`);
    }

    if (bugName !== undefined) {
      queryValues.push(`${bugName}`);
      whereExpressions.push(`bug_name = $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += ' WHERE ' + whereExpressions.join(' AND ');
    }

    // Finalize query and return results

    // query += ' ORDER BY priority';

    const bugRes = await db.query(query, queryValues);

    return bugRes.rows;
  }

  /** Given a bug name, return data about bug.
   *
   * Returns { bug_name, description, project, priority, last_status }
   *   where jobs is [{ id, title, salary, equity }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const bugRes = await db.query(
      `SELECT 
        id,
        bug_name AS "bugName",
        project,
        description,
        priority,
        last_status AS "lastStatus"
      FROM bug
      WHERE id = $1`,
      [id]
    );

    const bug = bugRes.rows[0];

    if (!bug) throw new NotFoundError(`No bug: ${bugName}`);

    return bug;
  }

  /** Given a project name, return data about project.
   *
   * Returns { bug_name, description, project, priority, last_status }
   *   where jobs is [{ id, title, salary, equity }, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async projectLookup() {
    const projectRes = await db.query(
      `SELECT 
          DISTINCT project,
          COUNT("bug_name")
        FROM bug
        GROUP BY project`
    );

    const projects = projectRes.rows;

    return projects;
  }

  static async projectBugLookup(name) {
    const projectBugRes = await db.query(
      `SELECT 
        id, 
        project, 
        bug_name AS "bugName", 
        description, 
        priority, 
        last_status AS "lastStatus"
      FROM bug
      WHERE project = $1`,
      [name]
    );

    const projectBugs = projectBugRes.rows;
    return projectBugs;
  }

  /** Update bug data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {bug_name, project, description, priority, last_status}
   *
   * Returns {bug_name, project, description, priority, last_status}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      bugName: 'bug_name',
      lastStatus: 'last_status',
    });
    const idVarIdx = '$' + (values.length + 1);

    const querySql = `UPDATE bug 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING 
                                id,          
                                bug_name AS "bugName",  
                                description, 
                                project,
                                last_status AS "lastStatus"`;
    const result = await db.query(querySql, [...values, id]);
    const bug = result.rows[0];

    if (!bug) throw new NotFoundError(`No bug: ${bugName}`);

    return bug;
  }

  /** Delete given bug from database; returns undefined.
   *
   * Throws NotFoundError if bug not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM bug
           WHERE id = $1
           RETURNING id, bug_name AS "bugName"`,
      [id]
    );
    const bug = result.rows[0];

    if (!bug) throw new NotFoundError(`No bug: ${id}`);
    return bug;
  }
}

module.exports = Bug;
