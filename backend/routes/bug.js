'use strict';

/** Routes for companies. */

const jsonschema = require('jsonschema');
const express = require('express');

const { BadRequestError } = require('../expressError');
const { ensureAdmin } = require('../middleware/auth');
const Bug = require('../models/bug');

const bugNewSchema = require('../schemas/bugNew.json');
const bugUpdateSchema = require('../schemas/bugUpdate.json');
const bugSearchSchema = require('../schemas/bugSearch.json');

const router = new express.Router();

/** POST / { bug } =>  { bug }
 *
 * bug should be { name, project, description, priority, last_status }
 *
 * Returns { name, project, description, priority, last_status }
 *
 * Authorization required: admin
 */

router.post('/', async function (req, res, next) {
  console.log(req);
  try {
    const validator = jsonschema.validate(req.body, bugNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const bug = await Bug.create(req.body);
    return res.status(201).json({ bug });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get('/', async function (req, res, next) {
  const q = req.query;
  try {
    const validator = jsonschema.validate(q, bugSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const bug = await Bug.findAll(q);
    return res.json({ bug });
  } catch (err) {
    return next(err);
  }
});

router.get('/project', async function (req, res, next) {
  try {
    const project = await Bug.projectLookup();

    return res.json({ project });
  } catch (err) {
    return next(err);
  }
});

/** GET /[bugName]]  =>  { bug }
 *
 *  Bug is { id, bug_name, description, project, priority, lastStatus }
 *
 *
 * Authorization required: none
 */

router.get('/:id', async function (req, res, next) {
  try {
    const bug = await Bug.get(req.params.id);
    return res.json({ bug });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[bugName] { fld1, fld2, ... } => { bug }
 *
 * Patches bug data.
 *
 * fields can be: { bug_name, description, project, priority, lastStatus }
 *
 * Returns { bug_name, description, project, priority, lastStatus }
 *
 * Authorization required: admin
 */

router.patch(
  '/:id',
  /**ensureAdmin, */ async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, bugUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const bug = await Bug.update(req.params.id, req.body);
      return res.json({ bug });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[bugName]  =>  { deleted: handle }
 *
 * Authorization: admin
 */

router.delete(
  '/:id',
  /** ensureAdmin, */ async function (req, res, next) {
    try {
      const delBug = await Bug.remove(req.params.id);
      console.log(delBug);
      return res.json({ deleted: delBug.bug_name });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
