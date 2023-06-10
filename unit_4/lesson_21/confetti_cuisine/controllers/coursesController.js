"use strict";

const Course = require("../models/course"),
  getCourseParams = (body) => {
    return {
      title: body.title,
      description: body.description,
      maxStudents: body.maxStudents,
      cost: body.cost,
    };
  };

module.exports = {
  index: (req, res, next) => {
    Course.find()
      .then((courses) => {
        res.locals.courses = courses;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("courses/index");
  },
  new: (req, res) => {
    res.render("courses/new");
  },
  create: (req, res, next) => {
    const courseParams = getCourseParams(req.body);
    Course.create(courseParams)
      .then((course) => {
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.error(`Error saving course: ${error.course}`);
        next(error);
      });
  },
  redirectView: (req, res) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    const courseId = req.params.id;
    Course.findById(courseId)
      .then((course) => {
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.error(`Error fetching couses by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("courses/show");
  },
  edit: (req, res, next) => {
    const courseId = req.params.id;
    Course.findById(courseId)
      .then((course) => {
        res.render("courses/edit", {
          course: course,
        });
      })
      .catch((error) => {
        console.error(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    const courseId = req.params.id,
      courseParams = getCourseParams(req.body);

    Course.findByIdAndUpdate(courseId, {
      $set: courseParams,
    })
      .then((course) => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    const courseId = req.params.id;
    Course.findByIdAndDelete(courseId)
      .then(() => {
        res.locals.redirect = "/courses";
        next();
      })
      .catch((error) => {
        console.error(`Error deleting course by ID: ${error.message}`);
        next(error);
      });
  },
};
