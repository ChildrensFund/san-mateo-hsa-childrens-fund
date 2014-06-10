#San Mateo Children's Fund: Deployment

##Requirements

The following documentation assumes deployment using Microsoft's Azure cloud service. To correctly deploy this application, you must generate an account on this service.

##Getting Started

Once your Azure account has been generated, log in and navigate to the Azure portal page. This page should consist of a header panel, a list of services in a blue pane on the left, a large central space that will list your created/active services, and a footer bar on the bottom.

After deciding on the domain for your website, you will need to make a small edit to the website source code before your deployment will be fully functional. This edit is explained in detail in the next section.

##Creating the Web Site

To create the web site service, click on the **+ New** button on the left edge of the footer bar. This opens a context menu listing services to create. Select **Compute** in the first column, then **Web Site** in the second column, and lastly select **Custom Create** from the third column. This will open a new window to configure the new site.

 - **URL**: All websites created using Azure are created as sub-domains of *azurewebsites.net*. This means the site will initially be deployed as "*yourDomain.azurewebsites.net*". While this isn't desirable, we will be able to fix what domain user's will see when they navigate to your site later on in this documentation.
> **Source Code Edit**: Now that you have decided on the domain for hosting your website on Azure, you will need to replace a line of code so that links sent via email (such as when a user needs a password reset) will point to the right page.
>
> - **auth_controller.js**: From the root folder of the website code, navigate to "*/server/controllers/auth_controller.js*" and open this file.
> - **Line 1: var domain**: The first line of code in this file declares the variable "*domain*" and assigns it a string. You must replace the current address in between the single-quotes with your chosen domain. *Note*: The single-quotes are necessary and there should be no spaces between them.
>   - *Example*: `var domain = 'http://hsa.azurewebsites.net';`
> - **Save**: Save the file, commit the change using Git, and push the committed change to your GitHub repository. Then proceed with the following Azure configuration.

 - **Web Hosting Plan**: Select the hosting plan suitable for your needs. The types of plans offered by Microsoft and how they pertain to your agency are beyond the scope of this documentation.
 - **Database**: Select "*Create a new MySQL database*". This will create a new field on the same window called "*DB Connection String Name*" and add an additional tab to the right edge of this configuration window.
 - **DB Connection String Name**: Enter "*hsa-cf-db*" without quotes. **THIS IS VERY IMPORTANT**: Entering any other name for this field will result with the website failing to function. This exact format, including hyphens, is specific to the code for this site.
 - **Publish from source control**: Check this box. This should create an additional tab to the right of this configuration window.

Now click the arrow in the bottom-right corner of the configuration window to move to the next step. This next step will configure the MySQL database.

 - **Name**: You may change this field if desired, but changing this field isn't required.
 - **Region**: Select "*West US*".
 - **Legal Terms and Privacy Statement**: Review the legal terms and privacy statement—both accessible by clicking their respective links next to the check box. This check box must be checked before proceeding.

Click the right arrow in the bottom-right corner of the configuration window to move to the last step. This step will allow us to select a GitHub repository from which Azure will retrieve the website code.

 - **Source List**: Select the "*GitHub*" option (it has a circular logo).

This will prompt a new browser window asking for your GitHub account information and credentials. After supplying these, you will be prompted to allow access for Azure to connect to GitHub. Allow this access. This will return you to the website configuration window.

 - **Repository**: Select the repository containing the code for the website.
 - **Branch**: Select "*Master*". Click on the arrow in the bottom-right corner to deploy the site.

##Deployed

Azure will then start copying the website code from the GitHub repository. The configuration window will disappear and you will notice a new website entry listed in your Azure portal. When its status reads "*Active*", the site will have been deployed successfully onto Azure. To test that it has deployed successfully, you may open a new browser window or tab and enter the domain you specified earlier in the address bar (i.e. "*yourDomain.azurewebsites.net*"). This should display the website.

#Setting a Custom Domain

Azure cloud services only allows web sites to be hosted as sub-domains of "*azurewebsites.net*", but it is possible to set another domain to point to the sub-domain we created. This will allow us to type the domain we actually want for the site into the address bar in a browser and it will navigate to this site without ever displaying "*azurewebsites.net*" in the address bar.

*Note*: Entering the original sub-domain of "*azurewebsites.net*" will still yield the same result, displaying the site as normal. The following steps only allow us to use a custom domain to still access the site.

##Requirements

To proceed, you must have a domain (or sub-domain) registered. You will need to set an A record and at least two CNAME records with your domain registrar. Additionally, the website must have already been deployed on Azure and the scale of the site must be set to *Shared*, *Basic*, or *Standard*. You can set the scale by going to your Azure portal, selecting the website, and clicking the *Scale* button at the top of the details pane.

##Change A Record

First we must tell the **domain name system** (**DNS**) to go to your Azure website instead of your domain registrar's default site. To do this, we set an A record, which will point your canonical domain name (example.com) to your Azure website's IP address.

 - **Manage Custom Domains Window**: In your Azure portal, select the website and click on the *Configure* button at the top of the details pane. Scrolling down in this pane, you will find a *Domain Names* section with a button labeled **Manage Domains**. Click this button to open the "*Manage Custom Domains*" window.
 - **Copy IP Address**: At the bottom of this window, you will see "*the IP address to use when you configure A records*". Copy the IP address specified.

Now navigate to your domain registrar and change the A record for your root domain to point to this IP address. The root domain is often represented by the "@" symbol, or it may not have an associated name.

###Time To Live (TTL)

Your domain registrar may also associate a TTL value with an A record or CNAME record. Generally the default value is acceptable and need not be changed.

##Change CNAME Records

Canonical name records (CNAME records) are an alternative method to pointing a domain to another location. Note that the above A record we set is still required in addition to the CNAME records we will be creating here. Each entry in the following list is labeled with the CNAME name you will create and is followed by the address it will point toward. Anywhere you see "*[sub-domain]*", apply the sub-domain name you supplied in front of "*.azurewebsites.net*" when you created the website.

 - **awverify**: Points to "*awverify.*[sub-domain]*.azurewebsites.net*". This will allow Azure to verify that you are the owner of your custom domain, which enables it to link the root domain to your website.
 - **www**: Points to "[sub-domain]*.azurewebsites.net*". This ensures that if a user types "*www*" before entering the domain in their browser, it will still go to the right destination.
 - **\***: Points to "[sub-domain]*.azurewebsites.net*". This makes sure that if any user enters a sub-domain for your custom domain (e.g. sub.example.com), they are still directed to your website. The asterisk "\*" is a wildcard applying to any sub-domain that does not already have a designated CNAME record.
