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

  static async create({ bugName, project, description, priority, status }) {
    const duplicateCheck = await db.query(
      `SELECT bug_name
           FROM bug
           WHERE bug_name = $1`,
      [bugName]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate bug: ${handle}`);

    const result = await db.query(
      `INSERT INTO bug
           (bug_name, project, description, priority, last_status)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, bug_name AS "bugName", project, description, priority, last_status AS "lastStatus"`,
      [bugName, project, description, priority, status]
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
                        bug_name,
                        project,
                        description,
                        priority,
                        last_status
                 FROM bug`;
    let whereExpressions = [];
    let queryValues = [];

    const { priority, lastStatus, bugName } = searchFilters;

    console.log(priority);

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
        bug_name AS bugName,
        project,
        description,
        priority,
        last_status AS lastStatus
      FROM bug
      WHERE id = $1`,
      [id]
    );

    const bug = bugRes.rows[0];

    if (!bug) throw new NotFoundError(`No bug: ${bugName}`);

    return bug;
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
    console.log('inside');
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
                                bug_name AS bugName,  
                                description, 
                                project,
                                last_status AS lastStatus`;
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
           RETURNING id, bug_name`,
      [id]
    );
    const bug = result.rows[0];

    if (!bug) throw new NotFoundError(`No bug: ${id}`);
    return bug;
  }
}

module.exports = Bug;
