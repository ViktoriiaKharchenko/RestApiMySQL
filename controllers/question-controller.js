
const db = require("../db/index");
const Question = db.questions;
const Op = db.Sequelize.Op;


const createQuestion = (req, res) => {

    if (!req.body) {
        res.status(400).json({
            success: false,
            error: 'You must provide a Question',
        });
        return;
    }

    const question = {
        title: req.body.title,
        text: req.body.text,
        name: req.body.name,
        age: req.body.age,
        answer: req.body.answer

    };

    Question.create(question)
        .then(() => {
            return res.status(201).json({
                success: true,
                id: question.id,
                message: 'Question created!',
            })
        })
        .catch(err => {
            return res.status(400).json({
                 err,
                 message: 'Question not created!'});
        });
};
const updateQuestion = (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    const id = req.params.id;

    Question.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if(num==1){
            return res.status(200).json({
                success: true,
                id: Question.id,
                message: 'Question updated!',
            })}
            else {
                return res.status(404).json({
                    message: 'Question not found!',
                })
            }
        })
        .catch(err => {
            return res.status(404).json({
                err,
                message: 'Question not updated!',
            })
        });
};

const deleteQuestion = (req, res) => {
    const id = req.params.id;

    Question.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                return res.status(200).json({ success: true, message: 'Question deleted'});
            } else {
                return res.status(404).json({ success: false, error: `Question not found` });
            }
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: err })
        });
};

const getQuestionById = (req, res) => {
    const id = req.params.id;

    Question.findByPk(id)
        .then(data => {
            if(data==null){
                return res.status(400).json({success: false, message: "no question found"})
            }
            return res.status(200).json({ success: true, data: data })
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: err })
            });

};

const getQuestions =  (req, res) => {

    Question.findAll()
        .then(data => {
            return res.status(200).json({ success: true, data: data})
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: err });
        });
};

//
module.exports = {
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestions,
    getQuestionById,
}
