//
//  DetailViewController.swift
//  NBCHackathon
//
//  Created by Lucas Farah on 3/5/16.
//  Copyright © 2016 Lucas Farah. All rights reserved.
//

import UIKit

class DetailViewController: UIViewController {

	@IBOutlet weak var lblTitle: UILabel!
	@IBOutlet weak var lblSeasonsMinutes: UILabel!
	@IBOutlet weak var lblDescription: UITextView!
	@IBOutlet weak var lblMatch: UILabel!
	@IBOutlet weak var imgvPoster: UIImageView!

	var dicInfo = [String: AnyObject]()

	override func viewDidLoad() {
		super.viewDidLoad()
		print("------")
		print(dicInfo)
		// Do any additional setup after loading the view.
		self.lblTitle.text = dicInfo["name"] as? String
		self.lblDescription.text = dicInfo["description"] as? String
		if let match = dicInfo["matchScore"]
		{
			self.lblMatch.text = "\(match)%"
		}
		if let seasons = dicInfo["numberOfSeasons"], let duration = dicInfo["episodeDuration"]
		{
			if seasons as! Int > 1
			{
				self.lblSeasonsMinutes.text = "\(seasons) seasons - \(duration) min"
			}
      else
      {
        self.lblSeasonsMinutes.text = "\(seasons) season - \(duration) min"
      }
		}
		self.imgvPoster.image = UIImage(urlString: dicInfo["picURL"] as! String)
	}
	@IBAction func butWatchNow(sender: AnyObject) {
	}

	override func didReceiveMemoryWarning() {
		super.didReceiveMemoryWarning()
		// Dispose of any resources that can be recreated.
	}

	/*
	 // MARK: - Navigation

	 // In a storyboard-based application, you will often want to do a little preparation before navigation
	 override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
	 // Get the new view controller using segue.destinationViewController.
	 // Pass the selected object to the new view controller.
	 }
	 */
}
