
function fromWizzard() {
    var wizzardFrom ='<section id="main-content">' +
        '<div class="row"><div class="col-md-12">' +
        '<div class="c_panel">' +
        '<div class="c_title">' +
        '<h2>Form Wizards</h2>' +
        '<div class="clearfix">' +
        '</div>' +
        '</div>' +
        '<div class="c_content">' +
        '<h5 class="head-style-1">' +
        '<span class="head-text-green">' +
        '<strong>Horizontal Form Wizard</strong>' +
        '</span></h5>' +
        '<div id="wizard1">' +
        '<ul class="nav nav-tabs" role="tablist">' +
        '<li role="presentation" class="active">' +
        '<a href="#tab1" data-toggle="tab">' +
        '<i class="fa fa-user m-r-xs">' +
        '</i> Personal Info    </a>' +
        '</li><li role="presentation">' +
        '<a href="#tab2" data-toggle="tab">' +
        '<i class="fa fa-shopping-cart m-r-xs">' +
        '</i> Product Info    </a>' +
        '</li><li role="presentation">' +
        '<a href="#tab3" data-toggle="tab">' +
        '<i class="fa fa-cc-visa m-r-xs">' +
        '</i> Payment</a>' +
        '</li>' +
        '<li role="presentation">' +
        '<a href="#tab4" data-toggle="tab">' +
        '<i class="fa fa-check m-r-xs">' +
        '</i> Finish    </a>' +
        '</li>' +
        '</ul>' +
        '<div class="progress progress-sm m-t-sm margin-top-15">' +
        '<div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 0%">' +
        '</div>' +
        '</div>' +
        '<form id="wizardForm1" class="validator"><div class="tab-content">' +
        '<div class="tab-pane active fade in" id="tab1"><div class="row margin-bottom-10">' +
        '<div class="col-md-6"><div class="row">' +
        '<div class="form-group col-md-6">' +
        '<label for="fullname">Full Name</label>' +
        '<input type="text" class="form-control" name="fullname" id="fullname" placeholder="Full Name"></div>' +
        '<div class="form-group  col-md-6"><label for="email">Email Address</label>' +
        '<input type="text" class="form-control" name="email" id="email" placeholder="Email Address" >' +
        '</div>' +
        '<div class="form-group col-md-12"><label for="pass1">Password</label>' +
        '<input type="password" class="form-control" name="pass1" id="pass1" placeholder="Password" >' +
        '</div>' +
        '<div class="form-group col-md-12">' +
        '<label for="passa">Confirm Password</label>' +
        '<input type="password" class="form-control" name="pass2" id="passa" placeholder="Confirm Password">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
        '<h3>Personal Info</h3><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="tab-pane fade" id="tab2"><div class="row">' +
        '<div class="col-md-3">' +
        '<img src="../../../assets/images/google-logo.png" width="250" alt="image"><div class="m-t-md">' +
        '<address>' +
        '<strong>Google, Inc.</strong>' +
        '<br>    123 Abc Ave, Street 100' +
        '<br>    My City, ST 99999' +
        '<br>    <abbr title="Phone">P:</abbr> (123) 456-7890</address><address>' +
        '<strong>Full Name</strong><br>' +
        '<a href="mailto:#">first.last@example.com</a></address>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-9"><div class="form-group col-md-12"><label for="productName">Product Name' +
        '</label>' +
        '<input type="text" class="form-control" name="productName" id="productName" placeholder="Product Name" >' +
        '</div>' +
        '<div class="form-group col-md-12">' +
        '<label for="productId">Product ID</label>' +
        '<input type="text" class="form-control" name="productId" id="productId" placeholder="Product ID">' +
        '</div>' +
        '<div class="form-group col-md-12"><label for="quantity">Quantity</label>' +
        '<input type="number" min="1" max="5" class="form-control" name="quantity" id="quantity" placeholder="Quantity">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="tab-pane fade" id="tab3"><div class="row">' +
        '<div class="col-md-12"><div class="form-group col-md-12">' +
        '<label for="exampleInputCard">Card Number</label>' +
        '<div class="row"><div class="col-md-8">' +
        '<input type="text" class="form-control" name="exampleInputCard" id="exampleInputCard" placeholder="Card Number"></div><div class="col-md-4">' +
        '<input type="text" class="form-control col-md-4" name="exampleInputSecurity" id="exampleInputSecurity" placeholder="Security Code">' +
        '</div></div></div><div class="form-group col-md-12">' +
        '<label for="exampleInputHolder">Card Holders Name</label>' +
        '<input type="text" class="form-control" name="exampleInputHolder" id="exampleInputHolder" placeholder="Card Holders Name"></div><div class="form-group col-md-12">    <label for="exampleInputExpiration">Expiration</label>    <input type="text" class="form-control date-picker" name="exampleInputExpiration" id="exampleInputExpiration" placeholder="Expiration"></div><div class="form-group col-md-12">    <label for="exampleInputCsv">CSV</label>    <input type="text" class="form-control" name="exampleInputCsv" id="exampleInputCsv" placeholder="CSV"></div><div class="form-group col-md-12">    <label class="f-s-12">By pressing Next You will Agree to the Payment <a href="#">Terms & Conditions</a></label></div>    </div></div>    </div>    <div class="tab-pane fade" id="tab4"><h2 class="no-s">Thank You !</h2><div class="alert alert-info m-t-sm m-b-lg" role="alert">    Congratulations ! You got the last step.</div>    </div>    <ul class="pager wizard"><li class="previous"><a href="#" class="btn btn-default"><i class="fa fa-long-arrow-left"></i> Previous</a></li><li class="next"><a href="#" class="btn btn-default">Next <i class="fa fa-long-arrow-right"></i></a></li></ul></div></form></div>'
    
}
