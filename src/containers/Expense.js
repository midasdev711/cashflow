import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import * as ExpenseActions from '../actions/ExpenseActions';
import { connect } from "react-redux";

import { Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import {grey500} from "material-ui/styles/colors";

class Expense extends Component {

    state = {
        open: true
    };

    componentWillMount () {
        this.props.actions.loadExpense(this.props.params.id);
        this.props.actions.loadExpenseComments(this.props.params.id);
    }

    handleClose = () => {
        this.setState({ open: false });
        this.context.router.push("/expenses");
    };

    render () {
        const expense = this.props.expense.data;
        const comments = this.props.expense.comments;
        const title = expense.description + " (" + expense.expense_date + ")";
        const reimbursement = expense.reimbursement;
        const actions = [
            <FlatButton
                label="Stäng"
                primary={true}
                onTouchTap={this.handleClose}
            />
        ];

        return (
            <Dialog open={this.state.open} modal={true} autoScrollBodyContent={true} title={title} actions={actions}>
                <Subheader>Kvittodelar</Subheader>

                <Table selectable={false}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow selectable={false}>
                            <TableHeaderColumn>Nämnd</TableHeaderColumn>
                            <TableHeaderColumn>Budgetpost</TableHeaderColumn>
                            <TableHeaderColumn>Kostnadsställe</TableHeaderColumn>
                            <TableHeaderColumn>Belopp</TableHeaderColumn>
                            <TableHeaderColumn>Attestdatum</TableHeaderColumn>
                            <TableHeaderColumn>Attesterat av</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows={true}>
                        {!expense.expense_parts ? false : expense.expense_parts.map(row => (
                                <TableRow key={row.id}>
                                    <TableRowColumn>{row.budget_line.cost_centre.committee.committee_name}</TableRowColumn>
                                    <TableRowColumn>{row.budget_line.cost_centre.cost_centre_name}</TableRowColumn>
                                    <TableRowColumn>{row.budget_line.budget_line_name}</TableRowColumn>
                                    <TableRowColumn><em>{row.amount} SEK</em></TableRowColumn>
                                    <TableRowColumn>
                                        {row.attest_date
                                            ? <span>{row.attest_date}</span>
                                            : <em style={{color: grey500}}>Ej attesterad</em>
                                        }
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {row.attested_by
                                            ? <span>{row.attested_by_first_name} {row.attested_by_last_name}</span>
                                            : <em style={{color: grey500}}>Ej attesterad</em>
                                        }
                                    </TableRowColumn>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                <Subheader>Kommentarer</Subheader>

                <Table selectable={false}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow selectable={false}>
                            <TableHeaderColumn>Kommentar</TableHeaderColumn>
                            <TableHeaderColumn>Författare</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {!comments
                            ? <TableRow>
                                <TableRowColumn style={{color: grey500}}><br />Inga kommentarer<br /><br /></TableRowColumn>
                            </TableRow>
                            : comments.map(row => (
                                <TableRow key={row.id}>
                                    <TableRowColumn>{row.content}</TableRowColumn>
                                    <TableRowColumn>{row.author_first_name} {row.author_last_name} ({row.date})</TableRowColumn>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                <Subheader>Återbetalning</Subheader>

                <Table selectable={false}>
                    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                        <TableRow selectable={false}>
                            <TableHeaderColumn>Datum</TableHeaderColumn>
                            <TableHeaderColumn>Mottagare</TableHeaderColumn>
                            <TableHeaderColumn>Belopp</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {!reimbursement
                            ? <TableRow>
                                <TableRowColumn style={{color: grey500}}><br />Inga kommentarer<br /><br /></TableRowColumn>
                            </TableRow>
                            : <TableRow>
                                <TableRowColumn>{reimbursement.date}</TableRowColumn>
                                <TableRowColumn>
                                    {reimbursement.receiver.first_name} {reimbursement.receiver.last_name}
                                </TableRowColumn>
                                <TableRowColumn>{reimbursement.amount} SEK</TableRowColumn>
                            </TableRow>}
                    </TableBody>
                </Table>
            </Dialog>
        );
    }
}

Expense.propTypes = {
    expense: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
};

Expense.contextTypes = {
    router: PropTypes.object.isRequired
};

function mapStateToProps (state) {
    return {
        expense: state.expense
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ExpenseActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Expense);