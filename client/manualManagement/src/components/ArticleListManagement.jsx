import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/AddCircle';

import ArticleManagement from 'components/ArticleManagement.jsx';

import { getArticles } from 'api/content.js';
import { createArticle, modifyArticle, removeArticle } from 'api/admin.js';

import './ArticleListManagement.css';

export default class ArticleListManagement extends React.Component {
    static propTypes = {
        chapterID: PropTypes.string,
        sectionID: PropTypes.string,
        open: PropTypes.bool,
        onArticleToggle: PropTypes.func,
        onLoadingChange: PropTypes.func,
        part: PropTypes.number
    };

    constructor(props) {
        super(props);

        this.state = {
            articles: [],
            modalOpen: [false, false, false],
            modalInputText: '',
            modalInputArticleLevel: 'none',
            uploadFileName: ''
        };

        this.articleToManage = null;
        this.uploadFile = null;

        this.handleCreateToggle = this.handleCreateToggle.bind(this);
        this.handleModifyToggle = this.handleModifyToggle.bind(this);
        this.handleRemoveToggle = this.handleRemoveToggle.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalInputChange = this.handleModalInputChange.bind(this);
        this.handleModalSelectChange = this.handleModalSelectChange.bind(this);
        this.handleCreateArticle = this.handleCreateArticle.bind(this);
        this.handleModifyArticle = this.handleModifyArticle.bind(this);
        this.handleRemoveArticle = this.handleRemoveArticle.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);

        this.articleNum = [
            '一', '二', '三', '四', '五', 
            '六', '七', '八', '九', '十', 
            '十一', '十二', '十三', '十四', '十五', 
            '十六', '十七', '十八', '十九', '二十',
            '二十一', '二十二', '二十三', '二十四', '二十五', 
            '二十六', '二十七', '二十八', '二十九', '三十', 
            '三十一', '三十二', '三十三', '三十四', '三十五', 
            '三十六', '三十七', '三十八', '三十九', '四十', 
            '四十一', '四十二', '四十三', '四十四', '四十五', 
            '四十六', '四十七', '四十八', '四十九', '五十', 
            '五十一', '五十二', '五十三', '五十四', '五十五', 
            '五十六', '五十七', '五十八', '五十九', '六十', 
            '六十一', '六十二', '六十三', '六十四', '六十五', 
            '六十六', '六十七', '六十八', '六十九', '七十', 
            '七十一', '七十二', '七十三', '七十四', '七十五', 
            '七十六', '七十七', '七十八', '七十九', '八十', 
            '八十一', '八十二', '八十三', '八十四', '八十五', 
            '八十六', '八十七', '八十八', '八十九', '九十', 
            '九十一', '九十二', '九十三', '九十四', '九十五', 
            '九十六', '九十七', '九十八', '九十九', '一百'
        ];
    }

    componentDidMount() {
        this.getArticles();
    }

    render() {
        return (
            <div>
                <div>
                    <Modal open={this.state.modalOpen[0]}
                           onClose={this.handleModalClose}
                    >
                        <Paper className='modal-paper'>
                            <Typography variant='headline'>新增</Typography>
                            <FormControl fullWidth>
                                <InputLabel>標題文字</InputLabel>
                                <Input value={this.state.modalInputText} onChange={this.handleModalInputChange} />
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>參考度</InputLabel>
                                <Select value={this.state.modalInputArticleLevel}
                                        onChange={this.handleModalSelectChange}
                                >
                                    <MenuItem value='none'>無</MenuItem>
                                    <MenuItem value='A'>A</MenuItem>
                                    <MenuItem value='B'>B</MenuItem>
                                    <MenuItem value='C'>C</MenuItem>
                                </Select>
                            </FormControl>
                            <Grid className='margin-top-20px' spacing={4} container>
                                <Grid xs={3} item>
                                    <FormControl fullWidth>
                                        <Button component='label' variant='contained'>
                                            <Input type='file' inputRef={ref => this.uploadFile = ref} style={{display: 'none'}} onChange={this.handleFileSelect} />
                                            <Typography variant='body1'>上傳檔案</Typography>
                                        </Button>
                                    </FormControl>
                                </Grid>
                                <Grid xs={9} item>
                                    <Typography className='margin-left-20px padding-top-10px' component='span'>{this.state.uploadFileName}</Typography> 
                                </Grid>
                            </Grid>
                            <div className='margin-top-20px text-align-right'>
                                <Button variant='contained' onClick={this.handleCreateArticle} color='primary'>送出</Button>
                            </div>
                        </Paper>
                    </Modal>
                    <Modal open={this.state.modalOpen[1]}
                           onClose={this.handleModalClose}
                    >
                        <Paper className='modal-paper'>
                            <Typography variant='headline'>編輯</Typography>
                            <FormControl fullWidth>
                                <InputLabel>標題文字</InputLabel>
                                <Input value={this.state.modalInputText} onChange={this.handleModalInputChange} />
                            </FormControl>
                            <Grid className='margin-top-20px' spacing={4} container>
                                <Grid xs={3} item>
                                    <FormControl fullWidth>
                                        <Button component='label' variant='contained'>
                                            <Input type='file' inputRef={ref => this.uploadFile = ref} style={{display: 'none'}} onChange={this.handleFileSelect} />
                                            <Typography variant='body1'>上傳檔案</Typography>
                                        </Button>
                                    </FormControl>
                                </Grid>
                                <Grid xs={9} item>
                                    <Typography className='margin-left-20px padding-top-10px' component='span'>{this.state.uploadFileName}</Typography> 
                                </Grid>
                            </Grid>
                            <div className='margin-top-20px text-align-right'>
                                <Button variant='contained' onClick={this.handleModifyArticle} color='primary'>送出</Button>
                            </div>
                        </Paper>
                    </Modal>
                    <Modal open={this.state.modalOpen[2]}
                           onClose={this.handleModalClose}
                    >
                        <Paper className='modal-paper'>
                            <Typography variant='headline'>刪除</Typography>
                            <Typography variant='body1'>確定要刪除嗎？</Typography>
                            <div className='margin-top-20px text-align-right'>
                                <Button variant='contained' onClick={this.handleRemoveArticle} color='primary'>確定</Button>
                            </div>
                        </Paper>
                    </Modal>
                </div>
                <Collapse in={this.props.open} timeout='auto'>
                    <List component='div'>
                        {this.state.articles.map((obj, i) => (
                            <ArticleManagement index={i}
                                               article={obj}
                                               articleNum={i<this.articleNum.length ? this.articleNum[i] : this.articleNum[this.articleNum.length-1]}
                                               onArticleToggle={this.props.onArticleToggle}
                                               onRemoveToggle={this.handleRemoveToggle}
                                               onModifyToggle={this.handleModifyToggle}
                                               onLoadingChange={this.onLoadingChange}
                            />
                        ))}
                        <ListItem button onClick={this.handleCreateToggle}>
                            <AddIcon className='margin-left-60px'/>
                            <ListItemText primary='新增內容' />
                        </ListItem>
                    </List>
                </Collapse>
            </div>
        );
    }

    getArticles() {
        this.props.onLoadingChange(true, () => {
            getArticles(this.props.sectionID=='' ? this.props.chapterID : this.props.sectionID).then(articles => {
                this.setState({articles: articles}, () => {
                    this.props.onLoadingChange(false);
                });
            }).catch(err => {
                console.error('Error getting sections', err);
                this.props.onLoadingChange(false);
            });
        });
    }

    handleCreateToggle() {
        this.setState({modalOpen: [true, false, false]});
    }

    handleModifyToggle(articleID, text='') {
        this.articleToManage = articleID;
        this.setState({modalOpen: [false, true, false], modalInputText: text});
    }

    handleRemoveToggle(articleID) {
        this.articleToManage = articleID;
        this.setState({modalOpen: [false, false, true]});
    }

    handleModalClose() {
        this.articleToManage = null;
        this.setState({modalOpen: [false, false, false], modalInputText: '', modalInputArticleLevel: 'none', uploadFileName: ''});
    }

    handleModalInputChange(event) {
        this.setState({modalInputText: event.target.value});
    }

    handleModalSelectChange(event) {
        this.setState({modalInputArticleLevel: event.target.value});
    }

    handleFileSelect() {
        this.setState({uploadFileName: this.uploadFile.files[0].name});
    }

    handleCreateArticle() {
        if (this.uploadFile!=null && this.state.modalInputText!='' && this.state.modalInputArticleLevel!=null) {
            const data = new FormData();
            data.append('file', this.uploadFile.files[0]);
            data.append('articleText', this.state.modalInputText);
            data.append('chapterID', this.props.chapterID);
            data.append('sectionID', this.props.sectionID);
            data.append('level', this.state.modalInputArticleLevel);
            data.append('part', this.props.part);
            this.props.onLoadingChange(true, () => {
                createArticle(data).then(articles => {
                    this.setState({articles: articles}, () => {
                        this.handleModalClose();
                        this.props.onLoadingChange(false);
                    });
                }).catch(err => {
                    console.error('Error creating article', err);
                    this.props.onLoadingChange(false);
                    alert('新增失敗');
                });
            });
        }
    }
    
    handleModifyArticle() {
        const data = new FormData();
        data.append('articleID', this.articleToManage);
        if (this.uploadFile!=null)
            data.append('file', this.uploadFile.files[0]);
        if (this.modalInputText!='')
            data.append('articleText', this.state.modalInputText);
        this.props.onLoadingChange(true, () => {
            modifyArticle(data).then(articles => {
                this.setState({articles: articles}, () => {
                    this.handleModalClose();
                    this.props.onLoadingChange(false);
                });
            }).catch(err => {
                console.error('Error modifying article', err);
                this.props.onLoadingChange(false);
                alert('編輯失敗');
            });
        });
    }

    handleRemoveArticle() {
        if (this.articleToManage!=null) {
            this.props.onLoadingChange(true, () => {
                removeArticle(this.articleToManage).then(articles => {
                    this.setState({articles: articles}, () => {
                        this.handleModalClose();
                        this.props.onLoadingChange(false);
                    });
                }).catch(err => {
                    console.error('Error removing article', err);
                    this.props.onLoadingChange(false);
                    alert('請先清除內容');
                });
            });
        }
    }
}
