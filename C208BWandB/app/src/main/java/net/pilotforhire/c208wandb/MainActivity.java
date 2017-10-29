package net.pilotforhire.c208wandb;

import android.app.*;
import android.os.*;
import android.webkit.*;
import android.view.*;
import android.widget.*;
import android.content.*;
import android.view.ViewGroup.LayoutParams;
import android.text.*;
import android.content.res.Resources;
//import android.support.v7.app.AppCompatActivity;

public class MainActivity extends Activity {
	
	WebView wandb;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);
		
		wandb = (WebView) findViewById(R.id.wandb);
	
		WebSettings wandbSettings = wandb.getSettings();
		wandbSettings.setBuiltInZoomControls(false);
		wandbSettings.setDisplayZoomControls(false);
		wandbSettings.setJavaScriptEnabled(true);
		wandbSettings.setDomStorageEnabled(true);
		
		wandb.loadUrl("file:///android_asset/www/wandb.html");

	}
		
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		MenuInflater inflater = getMenuInflater();
		inflater.inflate(R.menu.app_menu, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
	// Handle item selection
		String dialog, title;
		String fileName;
		switch (item.getItemId()) {
		case R.id.fuel_request:
			Intent fuel = new Intent(this, FuelRequestActivity.class);
			startActivity(fuel);
 			return true;
 		case R.id.calc:
 			dialog = "calculator.html";
 			title = "";
 			showDialog(dialog,title);
 			return true;
		case R.id.help:
			dialog = "help.html";
			title = "Help";
			showDialog(dialog,title);
			return true;
		case R.id.about:
			dialog = "about.html";
			title = "About the Application";
			showDialog(dialog,title);
			return true;
		default:
			return super.onOptionsItemSelected(item);
		}
	}

	
	public void showDialog(String dialog,String title) {
		AlertDialog.Builder alert = new AlertDialog.Builder(this); 
		alert.setTitle(title);
		
		WebView webView = new WebView(this);
	//	webView.setLayoutParams(new WebView.LayoutParams(layout_width.200, layout_height.200));
		webView.loadUrl("file:///android_asset/www/" + dialog);
		
		WebSettings webViewSettings = webView.getSettings();
		
		webViewSettings.setJavaScriptEnabled(true);

		alert.setView(webView);
		alert.setNegativeButton("Close", new DialogInterface.OnClickListener() {
		    @Override
		    public void onClick(DialogInterface dialog, int id) {
		    	dialog.dismiss();
		    }
		});
		alert.show();
	}
	
}

