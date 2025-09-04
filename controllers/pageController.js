const e = require("express");
const User = require('../models/User');

const WeeklyFiles = require("../models/WeeklyFiles");

exports.getLoginPage = (req, res) => {
    res.render("login", { title: "Yeni Umutlar Anaokulu" });
};

exports.getİndexPage = async (req, res) => {
    try {
        const user = req.user;
        const weeklyFiles = await WeeklyFiles.findOne().sort({ uploadedAt: -1 });
        res.render('index', { user, weeklyFiles });
    } catch (error) {
        console.error('Error rendering index page:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getMontessoriPage = async (req, res) => {
    try {
        const user = req.user;

        const weeklyFiles = await WeeklyFiles.findOne().sort({ uploadedAt: -1 });
        res.render('blog-montessori', { user, weeklyFiles });
    } catch (error) {
        console.error('Error rendering Montessori page:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getWaldorfPage = async (req, res) => {
    try {
        const user = req.user;
        const weeklyFiles = await WeeklyFiles.findOne().sort({ uploadedAt: -1 });
        res.render('blog-waldorf', { user, weeklyFiles });
    } catch (error) {
        console.error('Error rendering Waldorf page:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getMotorBeceriPage = async (req, res) => {
    try {
        const user = req.user;
        const weeklyFiles = await WeeklyFiles.findOne().sort({ uploadedAt: -1 });
        res.render('blog-motorbeceri', { user, weeklyFiles });
    } catch (error) {
        console.error('Error rendering Motor Beceri page:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getStemPage = async (req, res) => {

    try {
        const user = req.user;
        const weeklyFiles = await WeeklyFiles.findOne().sort({ uploadedAt: -1 });
        res.render('blog-stem', { user, weeklyFiles });
    } catch (error) {
        console.error('Error rendering STEM page:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.getBlogsPage = async (req, res) => {
    try {
        const user = req.user;
        const weeklyFiles = await WeeklyFiles.findOne().sort({ uploadedAt: -1 });
        res.render('blogs', { user, weeklyFiles });
    } catch (error) {
        console.error('Error rendering Blogs page:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getHakkimizdaPage = async (req, res) => {
    try {
        const user = req.user;
        const weeklyFiles = await WeeklyFiles.findOne().sort({ uploadedAt: -1 });
        res.render('hakkimizda', { user, weeklyFiles });
    } catch (error) {
        console.error('Error rendering Hakkimizda page:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getIletisimPage = async (req, res) => {
    try {
        const user = req.user;
        const weeklyFiles = await WeeklyFiles.findOne().sort({ uploadedAt: -1 });
        res.render('iletisim', { user, weeklyFiles });
    } catch (error) {
        console.error('Error rendering Iletisim page:', error);
        res.status(500).send('Internal Server Error');
    }
};

