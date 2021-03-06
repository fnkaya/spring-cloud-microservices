import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {fetchCategories} from "../../action/categoryActions";
import {Button, Icon, Message, Select, TextArea} from "semantic-ui-react";
import {DESCRIPTION_CHARACTER_LIMIT, validateMentorApplication} from "../../util/Validator";
import {Alert, Loader, Panel} from 'rsuite'
import { postApplicationForm } from "../../util/apiCall/ApplicationFormApiCall";

const ApplicationForm = () => {
    const { pending, categories, error } = useSelector(state => state.categoryState.toJS())
    const { principals } = useSelector(state => state.authState.toJS())
    const [ selectedCategory, setSelectedCategory ] = useState(null)
    const [ subjects, setSubjects ] = useState([])
    const [ selectedSubjects, setSelectedSubjects ] = useState([])
    const [ description, setDescription ] = useState('')
    const [ valid, setValid ] = useState(false)
    const [ submissionError, setSubmissionError ] = useState(undefined)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCategories())
    }, [])

    useEffect(() => {
        if (selectedCategory) {
            const subjects = selectedCategory.subjects.map(subject => ({
                key: subject,
                value: subject,
                text: subject
            }))

            setSubjects(subjects)
        }

        setSelectedSubjects([])
    }, [selectedCategory])

    useEffect(() => {
        if (selectedSubjects.length === 0) {
            setDescription('')
        }
    }, [selectedSubjects])

    useEffect(() => {
        setValid(validateMentorApplication(selectedCategory, selectedSubjects, description))
        setSubmissionError(undefined)
    }, [selectedCategory, selectedSubjects, description])

    const onCategorySelectedChange = (e, {value}) => {
        setSelectedCategory(value)
    }

    const onSubjectsSelectedChange = (e, {value}) => {
        const subjects = value.filter(o => selectedCategory.subjects.includes(o))
        setSelectedSubjects(subjects)
    }

    const onDescriptionChange = (e, {value}) => {
        setDescription(value)
    }

    const onSubmit = async () => {
        setSubmissionError(undefined)
        await postApplicationForm(principals.id, selectedCategory.name, selectedSubjects, description)
            .then(response => {
                if (response.status === 201) {
                    Alert.success("Mentorluk ba??vurunuz al??nd??.\nBa??vurunuzu de??erlendirip en k??sa s??rede geri d??n???? yapaca????z.", 5000)
                    setSelectedCategory(null)
                }
                else {
                    setSubmissionError(response.data.message)
                }
            })

    }

    const getCategoryNames = () => {
        return categories.map(category => ({
            key: category.id,
            value: category,
            text: category.name
        }))
    }

    return (
        <Panel bordered className='container p-5 bg-light' style={{height: '75vh', marginTop: 100}}>
            {
                error && (
                    <Message negative>
                        <Message.Header>Kategoriler y??klenirken bir hata olu??tu</Message.Header>
                        <p>{error.message}</p>
                    </Message>
                )
            }

            <label className='form-label'>Mentorl??k ba??vurusu yapmak istedi??iniz kategoriyi se??in</label>
            <Select name='selectedCategory' placeholder='Kategori se??in' className='d-block mb-5' search clearable
                    options={getCategoryNames()} onChange={onCategorySelectedChange} />

            {
                selectedCategory && (
                    <>
                        <label className='form-label'>Mentorl??k ba??vurusu yapmak istedi??iniz konuyu se??in
                            <span className='text-muted'>(Bir veya daha fazla konu se??imi yapabilirsiniz)</span>
                        </label>
                        <Select name='selectedSubjects' placeholder='Konu se??in' className='d-block mb-5'
                                search multiple options={subjects} onChange={onSubjectsSelectedChange} />
                    </>
                )
            }

            {
                selectedSubjects.length > 0 && (
                    <>
                        <label className='form-label'>L??tfen a????klama giriniz
                        <span className={valid ? 'text-success' : 'text-danger'}> ({description.length}/{DESCRIPTION_CHARACTER_LIMIT})</span>
                        </label>
                        <TextArea value={description} className='d-block w-100 mb-3 p-3' rows='10' onChange={onDescriptionChange} />
                        {submissionError && (<Message negative>{submissionError}</Message> )}
                        <Button disabled={!valid} icon color='violet' onClick={onSubmit}>
                            <Icon name='save'/>G??NDER
                        </Button>
                    </>
                )
            }

            {pending && (<Loader backdrop content="loading..." vertical />) }
        </Panel>
    )
}

export default ApplicationForm;