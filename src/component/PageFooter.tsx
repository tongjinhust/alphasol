import React from 'react';

export interface PageFooterProps {
    showslogan?: boolean
}

export default class PageFooter extends React.Component<PageFooterProps> {
    render() {
        return (
            <div className="m-page-footer">
                <div className="m-page-container">
                    <div className="m-page-footer-content">
                        { this.props.showslogan && <div className="m-page-footer-slogan">Trust Data, Trust Solpro</div>}
                        <a className="m-page-footer-subbtn" href="https://docs.google.com/forms/u/0/d/1hQ25oUoy03O9hHiGkDKehFqr19pyLBxQjjcnCkc4bD0/viewform?edit_requested=true" target="_blank">Submit your project</a>
                        <div className="m-page-footer-contract-label">CONTACT US</div>
                        <div className="m-page-footer-contract-items">
                            <a href="mailto:solpro.project@gmail.com">
                                <img src={ require("@images/common/icon-contact-mail.png") } />
                            </a>
                            <a href="https://twitter.com/SolProProject " target="_blank">
                                <img src={ require("@images/common/icon-contact-twitter.png") } />
                            </a>
                        </div>
                        <div className="m-page-footer-copyright">&copy; 2021 Solpro. All rights reserved.<br />Powered by AlphaPro. </div>
                    </div>
                </div>
            </div>
        );
    }
}